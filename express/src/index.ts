// src/index.ts
import express from 'express';
import cors from 'cors';
import { Client, Message, Server as OSCServer } from 'node-osc';
import { Server } from 'http';
import SSE, { errorMonitor } from "sse";
import { Response } from 'express-serve-static-core';


const app = express()
const server = new Server(app)
const sse = new SSE(server)
app.use(cors()) // Cors disables express default configuration of disabling request of different domains or ports

// Imports for JSON parsing
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


const port = 3000


// ------------------------------
// MongoDB Communication 
// ------------------------------  
// TODO: Timedout catch Error Code

// Get all VRHeadsets from DataBase
import mongoose from 'mongoose';
var CONNECTION_URL = "mongodb://0.0.0.0:27017/SatoreDataBase"

// Make connection to the MongoDB Server
mongoose.connect(CONNECTION_URL, {});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// ------------------------------
// Angular Get Communication
// ------------------------------

// Define a schema for the VRHeadsets collection
const vrHeadsetSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  ipAddress: { type: String, required: true },
  port: { type: String, required: true },
  name: { type: String, required: true }
}, { collection: 'VRHeadsets' });

// Create a model based on the schema
const VRHeadset = mongoose.model('VRHeadset', vrHeadsetSchema);

/*
app.get('/', (req, res) => {
  console.log("App.name is " + app.name)
  res.send('Hi, im up');
});
*/

//Endpoint to get all VRHeadsets
app.get('/', async (req, res) => {
  try {
    console.log("Retrieving VRHeadsets from MongoDB...");
    const headsets = await VRHeadset.find({});
    res.json(headsets);
  } catch (error) {
    // Assert error as an Error type
    const err = error as Error;
    res.status(500).json({ message: 'Error retrieving VR headsets', error: err.message });
  }
});

// Endpoint to add a new VRHeadset
app.post('/vrheadsets', async (req, res) => {
  try {
    console.log("Added new VR Headset! It's info his: " + req.body);
    const newHeadset = new VRHeadset(req.body);
    await newHeadset.save();
    res.status(201).json(newHeadset);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: 'Error adding VR headset', error: err.message });
  }
});




// ------------------------------
// Angular Post Communication
// ------------------------------


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

const oscServerPort = 3333;
const oscServerIp = '127.0.0.1';

// '127.0.0.1';

// Setup OSC server to listen for incoming messages.  old: 192.168.1.248
const oscServer = new OSCServer(oscServerPort, oscServerIp, () => {
  console.log('OSC Server is on IP: ' + oscServerIp);
  console.log('and on port:  ' + oscServerPort);
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
  console.log(`Express server is running on http://localhost:${port}`);
});
