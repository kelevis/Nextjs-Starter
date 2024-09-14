// app/api/websocket/route.ts
import { WebSocketServer } from 'ws';

const clients = new Map();

export const GET = (req) => {
    const { pathname } = new URL(req.url);
    const userId = pathname.split('/').pop();

    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
        clients.set(userId, ws);
        console.log(`Client ${userId} connected`);

        ws.on('message', (data) => {
            const message = JSON.parse(data);
            console.log(`Message from ${userId} to ${message.targetUserId}: ${message.content}`);

            const targetClient = clients.get(message.targetUserId);
            if (targetClient) {
                targetClient.send(JSON.stringify({
                    targetUserId: userId,
                    content: message.content,
                }));
            } else {
                console.log(`Target user ${message.targetUserId} not found`);
            }
        });

        ws.on('close', () => {
            clients.delete(userId);
            console.log(`Client ${userId} disconnected`);
        });
    });

    return new Response('WebSocket server is running', {
        headers: { 'Content-Type': 'text/plain' },
    });
};
