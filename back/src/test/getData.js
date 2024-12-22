import express from 'express';
import WebSocket from 'ws';

const app = express();
const port = 3000;

const besuWsUrl = 'ws://127.0.0.1:8546'; // URL của WebSocket node Besu (thay đổi nếu cần)
const ws = new WebSocket(besuWsUrl);

// Lưu trữ block mới nhận được để cung cấp qua API
let latestBlock = null;

// Hàm đăng ký nhận thông báo về các block mới
function subscribeToNewBlocks() {
  const subscriptionMessage = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_subscribe",
    params: ["newHeads"], // Đăng ký nhận thông báo khi có block mới
    id: 1
  });

  ws.send(subscriptionMessage);
}

// Hàm lấy chi tiết của block qua hash
function getBlockByHash(blockHash) {
  const requestMessage = JSON.stringify({
    jsonrpc: "2.0",
    method: "eth_getBlockByHash",
    params: [blockHash, true], // `true` để bao gồm danh sách transactions
    id: 2
  });
  ws.send(requestMessage);
}

// Khi WebSocket kết nối thành công
ws.on('open', () => {
  console.log("Connected to Besu WebSocket.");
  subscribeToNewBlocks(); // Đăng ký nhận thông báo về block mới
});

// Khi nhận được dữ liệu từ WebSocket
ws.on('message', (data) => {
  try {
    const parsedData = JSON.parse(data);

    // Kiểm tra xem có phải là thông báo về block mới không
    if (parsedData.method === 'eth_subscription' && parsedData.params.result) {
      const blockHash = parsedData.params.result.hash;
      console.log("New block detected with hash:", blockHash);

      // Lấy chi tiết block bằng hash và lưu lại
      getBlockByHash(blockHash);
    }

    // Kiểm tra nếu có dữ liệu chi tiết của block
    if (parsedData.id === 2 && parsedData.result) {
      latestBlock = parsedData.result; // Lưu block mới
      console.log("Block details:", JSON.stringify(parsedData.result, null, 2));
    }
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
  }
});

// Khi có lỗi xảy ra trong kết nối WebSocket
ws.on('error', (err) => {
  console.error("WebSocket error:", err);
});

// Khi kết nối WebSocket đóng
ws.on('close', () => {
  console.log("WebSocket connection closed.");
});

// Cung cấp API để lấy block mới nhất
app.get('/latest-block', (req, res) => {
  if (latestBlock) {
    res.json(latestBlock); // Trả về block mới nhất
  } else {
    res.status(404).json({ error: "No block data available yet." }); // Nếu chưa có block mới
  }
});

// Khởi chạy server Express
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
