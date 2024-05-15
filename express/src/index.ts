// src/index.ts
import express from 'express';
import cors from 'cors';
import { Client, Message, Server as OSCServer } from 'node-osc';
import { Server } from 'http';
import SSE from "sse";

const app = express()
const server = new Server(app)
const sse = new SSE(server);
app.use(cors())

const port = 3000;

app.get('/', (req, res) => {
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

// Sends Example Message to Client
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  const sendEvent = () => {
      res.write(`data: ${new Date().toISOString()}\n\n`);
  };

  const intervalId = setInterval(sendEvent, 1000);

  req.on('close', () => {
      clearInterval(intervalId);
      res.end();
  });
});

//server.listen(port, () => {
//  console.log(`SSE server running at http://localhost:${port}`);
//});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Setup OSC server to listen for incoming messages
const oscServer = new OSCServer(3333, '10.101.0.16', () => {
  console.log('OSC Server is listening on port 3333');
});
// Handle incoming OSC messages
oscServer.on('message', (msg) => {
    console.log(`Received OSC message: ${msg}`);
    // Process the message as needed
    // oscServer.close();
});
