// server.js
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        if (req.url.startsWith('/api/websocket')) {
            wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
                wss.emit('connection', ws, req);
            });
        } else {
            handle(req, res);
        }
    });

    const wss = new WebSocketServer({ noServer: true });

    server.listen(3000, () => {
        console.log('Server listening on http://localhost:3000');
    });
});
