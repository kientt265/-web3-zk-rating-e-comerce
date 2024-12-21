import fetch from 'node-fetch';
import http from 'http';

// URL của node Besu
const besuHttpUrl = 'http://127.0.0.1:8545';

// Biến để lưu số block trước đó
let lastBlockNumber = null;

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
            console.log("Latest block data:", data.result);
            const currentBlockNumber = parseInt(data.result.number, 16); // Chuyển đổi từ hex sang int

            // Kiểm tra xem có block mới không
            if (lastBlockNumber === null || currentBlockNumber > lastBlockNumber) {
                lastBlockNumber = currentBlockNumber; // Cập nhật số block mới nhất
                // Gọi hàm xử lý block mới ở đây nếu cần
                console.log("New block detected:", currentBlockNumber);
            }
        } else {
            console.error("Error fetching block:", data.error || "Unknown error");
        }
    } catch (err) {
        console.error("Error connecting to Besu:", err);
    }
}

// Gọi hàm để lấy block cuối cùng
getLatestBlock();

// Kiểm tra block mới mỗi 10 giây
setInterval(getLatestBlock, 10000); // 10000 ms = 10 giây

// Tạo server HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Besu block monitor is running.\n');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});