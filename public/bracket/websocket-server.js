const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast function to send messages to all connected clients
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Connection handler
wss.on('connection', ws => {
  console.log('New WebSocket connection');

  ws.on('message', message => {
    console.log('Received message:', message);
    broadcast(message); // Broadcast received message to all clients
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Serve static files (optional)
app.use(express.static('public'));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
