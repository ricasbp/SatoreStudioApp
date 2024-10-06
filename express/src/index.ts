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
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['offline', 'online', 'ready', 'error', 'running experience'], 
    required: true 
  },
  directingMode: { type: Boolean},
  isInEditMode: { type: Boolean},

}, { collection: 'VRHeadsets' });

// Create a model based on the schema
const VRHeadset = mongoose.model('VRHeadset', vrHeadsetSchema);

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
    if (req.body._id === "") {
      delete req.body._id;  // Remove _id if it's an empty string
    }
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

// Endpoint to update an existing VRHeadset
app.put('/vrheadsets/:id', async (req, res) => {
  console.log();
  console.log(`Updating VR Headset...`);

  try {
    const headsetId = req.params.id;
    console.log(`Updating VR Headset with ID: ${headsetId}`);
    console.log("New data: ", req.body);

    // Find the VR headset by ID and update it with the new data
    const updatedHeadset = await VRHeadset.findByIdAndUpdate(headsetId, req.body, { new: true });

    if (!updatedHeadset) {
      return res.status(404).json({ message: 'VR Headset not found' });
    }

    res.status(200).json(updatedHeadset);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: 'Error updating VR headset', error: err.message });
  }
});

// Endpoint to delete a VR headset by ID
app.delete('/vrheadsets/:id', async (req, res) => {
  console.log();
  console.log(`Deleting VR Headset...`);
  try {
    const headsetId = req.params.id;
    console.log(`Deleting VR Headset with ID: ${headsetId}`);

    // Find the VR headset by ID and delete it
    const deletedHeadset = await VRHeadset.findByIdAndDelete(headsetId);

    if (!deletedHeadset) {
      return res.status(404).json({ message: 'VR Headset not found' });
    }

    res.status(200).json({ message: 'VR Headset deleted successfully', deletedHeadset });
  } catch (error) {
    const err = error as Error;  // Assert that error is of type 'Error'
    res.status(400).json({ message: 'Error deleting VR headset', error: err.message });
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
  client.send(new Message("/StopExperience"), () => {
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
oscServer.on('message', (msg, rinfo) => {
  console.log(`Received OSC message: ${msg}`);
  console.log(`Received OSC from: ${rinfo.address}`);

  // Extract the message from the first element of the tuple
  const messageContent = msg[0];  // Assuming the first element is the message
  const status = messageContent.replace(/\//g, '');  // Remove all forward slashes

  const data = {
    status: status,
    ipAddress: rinfo.address,
    timestamp: new Date().toISOString(),
  };
  
  const formattedData = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.write(formattedData));

  // Process the message as needed.
  // oscServer.close();
});

// ------------------------------
// Others
// ------------------------------

// Start the Express server
app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});

