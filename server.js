// Run with: npm install ws
const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      clients.set(data.role, ws);
      console.log(`Registered role: ${data.role}`);
    } else {
      // Forward signaling messages (offer, answer, candidate) to the other peer
      const targetRole = data.role === 'sender' ? 'receiver' : 'sender';
      const targetWs = clients.get(targetRole);
      if (targetWs && targetWs.readyState === ws.OPEN) {
        targetWs.send(JSON.stringify(data));
      }
    }
  });

  ws.on('close', () => {
    for (const [role, client] of clients.entries()) {
      if (client === ws) clients.delete(role);
    }
  });
});
