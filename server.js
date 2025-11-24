// Web XR 멀티플레이용 WebSocket 서버
// 설치: npm install ws
// 실행: npm start

const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let state = {}; // 전송할 오브젝트 상태

wss.on('connection', (ws) => {
    console.log('Client connected');

    // 새 클라이언트에 현재 상태 전송
    ws.send(JSON.stringify(state));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            state = data;

            // 모든 클라이언트에게 브로드캐스트
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(state));
                }
            });
        } catch (err) {
            console.error('Invalid message', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);

