import fetch from 'node-fetch';
import http from 'http';

// URL của node Besu
const besuHttpUrl = 'http://127.0.0.1:8545';

// Hàm lấy block cuối cùng từ Besu

// Hàm lấy block cuối cùng từ Besu
async function getLatestBlock() {
    try {
        const response = await fetch(besuHttpUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getBlockByNumber",
                params: ["latest", true], // "latest" để lấy block mới nhất
                id: 1
            })
        });

        const data = await response.json();

        if (data.result) {
            return data.result; // Trả về dữ liệu block
        } else {
            return { error: data.error || "Unknown error" };
        }
    } catch (err) {
        return { error: `Error connecting to Besu: ${err.message}` };
    }
}

// Gọi hàm để lấy block cuối cùng
getLatestBlock();

// Tạo server HTTP
const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/latest-block') {
        const blockData = await getLatestBlock();

        // Set header JSON và trả về block data
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(blockData));
    } else {
        // Đường dẫn không hợp lệ
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});