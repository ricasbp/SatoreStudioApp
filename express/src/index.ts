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

// imports for JSON parsing
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Receives Angular command to retrieve the correct assets, from the server, for the specific VR specified with the IP.
// Requirment: JSON body is not empty, and has VR_IP and port.
app.post('/DownloadAssets', (req, res) => {
  console.log(req.body);
  // Extract ipAddress and port from the request body
  const { ipAddress, port } = req.body;

  if (!req.body || !ipAddress || !port) {
      return res.status(400).send("Missing pacakge, ipAddress, or port in request body");
  }

  // Use the extracted ipAddress and port
  const client = new Client(req.body.ipAddress, req.body.port);
  client.send(new Message("/DownloadAssets"), () => {
      client.close();
  });
  res.json({ message: "Hello, the message was sent" }); // Send JSON response
});

// Receives Angular command to start the experience for the specific VR specified with the IP.
// Requirment: JSON body is not empty, and has VR_IP and port.
app.post('/StartExperience', (req, res) => {
  console.log(req.body);
  // Extract ipAddress and port from the request body
  const { ipAddress, port } = req.body;

  if (!req.body || !ipAddress || !port) {
      return res.status(400).send("Missing ipAddress or port in request body");
  }

  // Use the extracted ipAddress and port
  const client = new Client(req.body.ipAddress, req.body.port);
  client.send(new Message("/StartExperience"), () => {
      client.close();
  });
  res.json({ message: "Hello, the message was sent" }); // Send JSON response
});

// Stop Experience
app.post('/StopExperience', (req, res) => {
  console.log(req.body);
  // Extract ipAddress and port from the request body
  const { ipAddress, port } = req.body;

  if (!req.body || !ipAddress || !port) {
      return res.status(400).send("Missing ipAddress or port in request body");
  }

  // Use the extracted ipAddress and port
  const client = new Client(req.body.ipAddress, req.body.port);
  client.send(new Message("/StartExperience"), () => {
      client.close();
  });
  res.json({ message: "Hello, the message was sent" }); // Send JSON response
});

// Restart Experience
app.post('/RestartExperience', (req, res) => {
  console.log(req.body);
  // Extract ipAddress and port from the request body
  const { ipAddress, port } = req.body;

  if (!req.body || !ipAddress || !port) {
      return res.status(400).send("Missing ipAddress or port in request body");
  }

  // Use the extracted ipAddress and port
  const client = new Client(req.body.ipAddress, req.body.port);
  client.send(new Message("/StartExperience"), () => {
      client.close();
  });
  res.json({ message: "Hello, the message was sent" }); // Send JSON response
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
// Sends Example Message to Angular Client
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


// '127.0.0.1';
/*
// Setup OSC server to listen for incoming messages.  old: 192.168.1.248
const oscServer = new OSCServer(port2, ipOSCServer, () => {
  console.log('OSC Server is on IP: ' + ipOSCServer);
  console.log('and on port:  ' + port2);
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

*/


/*  CODE FOR UDP OSC.JS 

const osc = require('osc') as any;

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  metadata: true
});

// Listen for incoming OSC messages.
udpPort.on("message", function (oscMsg: any, timeTag: any, info: any) {
  console.log("An OSC message just arrived!", oscMsg);
  console.log("Remote info is: ", info);
});

// Open the socket.
udpPort.open();


const portClient = 8001;
const ipOSCClient = '192.168.1.53';


// When the port is read, send an OSC message to, say, SuperCollider
udpPort.on("ready", function () {
  udpPort.send({
      address: "/s_new",
      args: [
          {
              type: "s",
              value: "default"
          },
          {
              type: "i",
              value: 100
          }
      ]
    }, ipOSCClient, portClient);
});

*/

//server.listen(port, () => {
//  console.log(`SSE server running at http://localhost:${port}`);
//});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
