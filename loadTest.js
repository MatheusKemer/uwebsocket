const WebSocket = require('ws');

const url = 'ws://localhost:3001';
const numberOfConnections = 10000;

const createConnection = (index) => {
  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log(`Connection ${index} opened`);
    setInterval(() => {
      const message = `Message from connection ${index}`;
      ws.send(message);
      console.log(`Connection ${index} sent: ${message}`);
    }, 1000);
  });

  ws.on('message', (data) => {
    console.log(`Connection ${index} received: ${data}`);
  });

  ws.on('close', () => {
    console.log(`Connection ${index} closed`);
  });

  ws.on('error', (error) => {
    console.error(`Connection ${index} error: ${error}`);
  });
};

for (let i = 0; i < numberOfConnections; i++) {
  createConnection(i);
}
