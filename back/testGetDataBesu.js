import fetch from 'node-fetch';

// URL của node Besu
const besuHttpUrl = 'http://127.0.0.1:8545';

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
        } else {
            console.error("Error fetching block:", data.error || "Unknown error");
        }
    } catch (err) {
        console.error("Error connecting to Besu:", err);
    }
}

// Gọi hàm để lấy block cuối cùng
getLatestBlock();
