// src/index.ts
import express from 'express';
import cors from 'cors';
import { Client, Message, Server } from 'node-osc';


const app = express()
app.use(cors())

const port = 3000;

app.get('/', (req, res) => {
    res.send('Hi, i´m up');
});

// http://localhost:3000/DownloadAssets
// JSON body has VR1_IP

app.get('/miau', (req, res) => {
    const client = new Client('192.168.1.248', 8001);
    client.send( new Message("/miau") , () => {
        client.close();
    });
    res.send('Hello, the message was sent');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Setup OSC server to listen for incoming messages
const oscServer = new Server(3333, '192.168.1.248', () => {
  console.log('OSC Server is listening on port 3333');
});
// Handle incoming OSC messages
oscServer.on('message', (msg) => {
    console.log(`Received OSC message: ${msg}`);
    // Process the message as needed
    // oscServer.close();
});


