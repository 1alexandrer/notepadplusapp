const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store current page content
let pageContent = {
  content: "Initial content",
  lastEditBy: null,
  lastEditTime: null
};

// Helper function to broadcast to all clients
const broadcast = (data, sender) => {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected!');

  // Send initial content
  ws.send(JSON.stringify({
    type: 'initialContent',
    ...pageContent
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'contentChange':
          pageContent = {
            content: data.content,
            lastEditTime: data.timestamp,
            lastEditBy: ws.idg
          };
          broadcast({
            type: 'contentUpdate',
            ...pageContent
          }, ws);
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (err) {
      console.error('Failed to parse message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.send("HelloWorld")
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});