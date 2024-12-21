import createDebug from 'debug';
import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import connectToMongoDb from './mongoDb.js';

import { saveNewBlockService } from './src/service/latestBlock.service.js'; // LatestBlock service   

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
  // const besuWsUrl = 'ws://127.0.0.1:8546'; // Đây là cổng WebSocket của Besu (thường là 8546)
  // // Khởi tạo WebSocket client
  // const ws = new WebSocket(besuWsUrl);

  // // Hàm đăng ký để nhận thông báo khi có block mới
  // function subscribeToNewBlocks() {
  //   const subscriptionMessage = JSON.stringify({
  //     jsonrpc: "2.0",
  //     method: "eth_subscribe",
  //     params: ["newHeads"], // Đăng ký nhận thông báo khi có block mới
  //     id: 1
  //   });

  //   ws.send(subscriptionMessage);
  // }

  // ws.on('open', () => {
  //   wsDebug("Connected to Besu WebSocket.");
  //   subscribeToNewBlocks();
  // });

  // ws.on('message', (data) => {
  //   const parsedData = JSON.parse(data);
  //   // Kiểm tra xem có thông báo về block mới không
  //   if (parsedData.method === 'eth_subscription' && parsedData.params.result) {
  //     wsDebug("New block data:", parsedData.params.result);
  //   }
  // });

  // ws.on('error', (err) => {
  //   console.error("WebSocket error:", err);
  // });

  // ws.on('close', () => {
  //   wsDebug("WebSocket connection closed.");
  // });

  app.use(cors)
  app.use(express.json());


  app.use('/api', blockRouter);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

boostrap(); 