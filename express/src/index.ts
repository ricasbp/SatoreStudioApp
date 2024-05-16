// src/index.ts
import express from 'express';
import cors from 'cors';
import { Client, Message, Server as OSCServer } from 'node-osc';
import { Server } from 'http';
import SSE from "sse";
import { Response } from 'express-serve-static-core';


const app = express()
const server = new Server(app)
const sse = new SSE(server);
app.use(cors())

const port = 3000;

app.get('/', (req, res) => {
    console.log("App.name is " + app.name);
    res.send('Hi, im up');
});

// http://localhost:3000/DownloadAssets
// JSON body has VR1_IP
app.get('/VRHeadsets', (req, res) => {
    const client = new Client('10.101.0.16', 8001);
    client.send( new Message("/miau") , () => {
        client.close();
    });
    res.send('Hello, the message was sent');
});

// Starts sse connection to client
sse.on('connection', (client) => {
  const sendEvent = () => {
      client.send(new Date().toISOString());
  };

  const intervalId = setInterval(sendEvent, 1000);

  client.on('close', () => {
      clearInterval(intervalId);
  });
});

// Michael
// Sends Example Message to Client
let clients: Response<any, Record<string, any>, number>[] = [];
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  const sendEvent = () => {
      res.write(`data: ${new Date().toISOString()}\n\n`);
  };

  clients.push(res);

  req.on('close', () => {
      res.end();
  });
});

//Michael
/*
app.get('/osc', (req, res) => {
  const data = {
    message: 'Online',
    timestamp: new Date().toISOString()
  };

  const formattedData = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.write(formattedData));
  res.send('Hello, the message was sent');
});
*/


// Setup OSC server to listen for incoming messages.  old: 192.168.1.248
const oscServer = new OSCServer(3333, '192.168.1.196', () => {
  console.log('OSC Server is listening on port 3333');
});


// Handle incoming OSC messages
oscServer.on('message', (msg) => {
    console.log(`Received OSC message: ${msg}`);

    const data = {
      message: msg,
      timestamp: new Date().toISOString()
    };
    const formattedData = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => client.write(formattedData));

    // Process the message as needed
    // oscServer.close();
});

//server.listen(port, () => {
//  console.log(`SSE server running at http://localhost:${port}`);
//});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
