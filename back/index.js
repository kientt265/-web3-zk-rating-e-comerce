import createDebug from 'debug';
import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import connectToMongoDb from './mongoDb.js';

import { saveNewBlockService } from './src/service/latestBlock.service.js'; // LatestBlock service   
import { processBlockData } from './src/service/dataProcessor.service.js'; // Data Processor service

import blockRouter from './src/routes/data.route.js';

const debug = createDebug('api:Application');
const wsDebug = createDebug('api:WebSocket');

const boostrap = async () => {

  const app = express();
  const port = 3000;

  connectToMongoDb();

  //TODO: MỞ COMMENT RA, CONNECT VỚI BESU
  //TODO: SAU ĐÓ CALL LAEST BLOCK SERVICE ĐỂ LƯU VÀO MONGODB => CALL Ở CÁI EVENT NÀO MÀ FETCH DATA VỀ ẤY
  //TODO: CÁI LATEST BLOCK MODEL LÀ VIẾT THEO SHAPE DATA CỦA E

  // // URL của node Besu với WebSocket (thay đổi theo cấu hình của bạn)
  const besuWsUrl = 'ws://127.0.0.1:8546'; // Đây là cổng WebSocket của Besu (thường là 8546)
  // // Khởi tạo WebSocket client
  const ws = new WebSocket(besuWsUrl);

  // // Hàm đăng ký để nhận thông báo khi có block mới
  function subscribeToNewBlocks() {
    const subscriptionMessage = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_subscribe",
      params: ["newHeads"], // Đăng ký nhận thông báo khi có block mới
      id: 1
    });

    ws.send(subscriptionMessage);
  }
  // Lấy thông tin block chi tiết bằng hash
  function getBlockByHash(blockHash) {
    const requestMessage = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBlockByHash",
      params: [blockHash, true], // `true` để bao gồm danh sách transactions
      id: 2
    });
    ws.send(requestMessage);
  }

  ws.on('open', () => {
    wsDebug("Connected to Besu WebSocket.");
    subscribeToNewBlocks();
  });

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

  ws.on('error', (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on('close', () => {
    wsDebug("WebSocket connection closed.");
  });

  app.use(cors)
  app.use(express.json());

    // Cung cấp API để lấy block mới nhất
  // app.get('/latest-block', (req, res) => {
  //   if (latestBlock) {
  //     res.json(latestBlock); // Trả về block mới nhất
  //   } else {
  //     res.status(404).json({ error: "No block data available yet." }); // Nếu chưa có block mới
  //   }
  // });
  app.use('/api', blockRouter);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

boostrap(); 