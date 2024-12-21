import WebSocket from 'ws';
import processBlock from '../services/blockService.js';

const connectBesu = (besuWsUrl) => {
    const ws = new WebSocket(besuWsUrl);

    ws.on('open', () => {
        console.log('Connected to Besu WebSocket');
        ws.send(JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_subscribe",
            params: ["newHeads"], // Nhận block mới
            id: 1,
        }));
    });

    ws.on('message', async (data) => {
        const message = JSON.parse(data);
        if (message.method === "eth_subscription" && message.params) {
            const block = message.params.result;
            console.log("New block received:", block);

            // Gọi service xử lý block
            await processBlock(block);
        }
    });

    ws.on('error', (err) => {
        console.error("WebSocket error:", err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
};

export default connectBesu;
