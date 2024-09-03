const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

ws.on('open', function open() {
  console.log('WebSocket connection established');
  ws.send('Hello Server');
});

ws.on('message', function incoming(data) {
  console.log(`Received: ${data}`);
  ws.close();
});

ws.on('error', function error(err) {
  console.error(`WebSocket error: ${err.message}`);
});
