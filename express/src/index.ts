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


// ------------------------------
// Start Express over HTTPs
// ------------------------------  
import fs from 'fs';
import http from 'http';
import https from 'https';

// Read SSL certificate and private key
const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpPort = 8080;
const httpsPort = 8443;
// Create HTTP and HTTPS servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);


const port = 3000


// ------------------------------
// Express to Angular Package Test (Simulates Unreal Sending Packages to application)
// ------------------------------  
app.get('/osc', (req, res) => {
  const data = {
    message: 'Online',
    timestamp: new Date().toISOString()
  };

  const formattedData = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.write(formattedData));
  res.send('Hello, the message was sent');
});


// ------------------------------
// MongoDB Setup Connection 
// ------------------------------  
// TODO: Timedout catch Error Code

// Get all VRHeadsets from DataBase
import mongoose from 'mongoose';
var CONNECTION_URL = "mongodb://0.0.0.0:27017/SatoreDataBase"

// Make connection to the MongoDB Server
mongoose.connect(CONNECTION_URL, {});
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection successful');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// ------------------------------
// Angular GET Commands
// ------------------------------

// Define a schema for the VRHeadsets collection
const vrHeadsetSchema = new mongoose.Schema({
  id: { type: Number, required: false },
  ipAddress: { type: String, required: true },
  port: { type: String, required: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['offline', 'online', 'ready', 'error', 'running experience'], 
    required: true 
  }
}, { collection: 'VRHeadsets' });

// Create a model based on the schema
const VRHeadset = mongoose.model('VRHeadset', vrHeadsetSchema);

/*
app.get('/', (req, res) => {
  console.log("App.name is " + app.name)
  res.send('Hi, im up');
});
*/

// Endpoint to get all VRHeadsets
app.get('/', async (req, res) => {
  try {
    const headsets = await VRHeadset.find({});
    res.json(headsets);
    console.log("Angular Request: Retrieved VRHeadsets from MongoDB.");
  } catch (error) {
    // Assert error as an Error type
    const err = error as Error;
    res.status(500).json({ message: 'Error retrieving VR headsets', error: err.message });
  }
});

// ------------------------------
// Angular POST Commands
// ------------------------------

// Endpoint to add a new VRHeadset
app.post('/vrheadsets', async (req, res) => {
  try {
    console.log("Adding new VR Headset! It's info is: " );
    console.log(req.body);
    const newHeadset = new VRHeadset(req.body);
    await newHeadset.save();
    res.status(201).json(newHeadset);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: 'Error adding VR headset', error: err.message });
  }
});

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


// ------------------------------
// SSE Code
// ------------------------------


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



// ------------------------------
// OSC Code
// ------------------------------


const oscServerPort = 3333;
const oscServerIp = '127.0.0.1';

// Setup OSC server to listen for incoming messages.  old: 192.168.1.248
const oscServer = new OSCServer(oscServerPort, oscServerIp, () => {
  console.log('OSC Server is on : ' + oscServerIp + ':' + oscServerPort);
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


// ------------------------------
// Others
// ------------------------------

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});


// Start the HTTP server
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server running on port ${httpPort}`);
});

// Start the HTTPS server
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server running on port ${httpsPort}`);
});
