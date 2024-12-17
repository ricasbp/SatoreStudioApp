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

const oscExpressPort = 3000
const vrHeadsetPort = 8001 // Defined in Unreal Engine OSCReceiver


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
    enum: ['offline', 'online', 'ready (synched)', 'error', 'experience running'], 
    required: true 
  },
  synchedMode: { type: Boolean},
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
      delete req.body._id;  // Remove _id to be able to insert in MongoDB.
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

// Endpoint to update an existing VRHeadset, and send corresponding OSC message
app.put('/vrheadsets/:id', async (req, res) => {
  try {
    const headsetId = req.params.id;
    const oldHeadset = await VRHeadset.findById(headsetId);

    if (!oldHeadset) {
      // Handle the case where the VR headset is not found
      return res.status(404).json({ message: "VR Headset not found." });
    }

    console.log(`Updating VR Headset with ID: ${headsetId}`);
    console.log("New data: ", oldHeadset);

    // Find the VR headset by ID and update it with the new data
    const updatedHeadset = await VRHeadset.findByIdAndUpdate(headsetId, req.body, { new: true });

    // Bug fix para nao enviar commandos sempre: 
    //    If updatedHeadset e igual a headset antigo, nao queremos fazer nada
    if (!updatedHeadset) {
      return res.status(404).json({ message: 'Not able to update the VR Headset.' });
    }
    console.log("Updated VRHeadset!");

    // Start OSC Command
    // If express receives Headset with "Running", and was "Online"
    if(oldHeadset.status == "online" && updatedHeadset.status == "experience running"){
          //  Send to correct device, OSC command: "Start"
          const client = new Client(updatedHeadset.ipAddress, vrHeadsetPort);
          client.send(new Message("/start"), () => {
            client.close();
          });
    }

    // Stop OSC Command
    // If express receives Headset with "Online", and was "Running"
    if(oldHeadset.status == "experience running" && updatedHeadset.status == "online"){
      //  Send to correct device, OSC command: "Start"
      const client = new Client(updatedHeadset.ipAddress, vrHeadsetPort);
      client.send(new Message("/stop"), () => {
        client.close();
      });
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
  // Extract the message from the first element of the tuple
  const messageContent = msg[0];
  const msgIpAddress = msg[1];

  // Check if msg ois corrects
  if (!messageContent) {
    console.error("Osc msg doesn't have content.");
  }
  if ( !msgIpAddress) {
    console.error("Osc msg doesn't have IPadress.");
  }

  const status = messageContent.replace(/\//g, '');  // Remove all forward slashes

  const data = {
    ipAddress: msgIpAddress,
    status: status,
    timestamp: new Date().toISOString(),
  };

  console.log(data)
  
  const formattedData = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach(client => client.write(formattedData));

  // Process the message as needed.
  // oscServer.close();
});

// ------------------------------
// Others
// ------------------------------

// Start the Express server
app.listen(oscExpressPort, () => {
  console.log(`Express server is running on http://localhost:${oscExpressPort}`);
});

