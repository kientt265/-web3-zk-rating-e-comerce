import createDebug from 'debug';
import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import connectToMongoDb from './mongoDb.js';

import blockRouter from './src/routes/data.route.js';
import dealRouter from './src/routes/dataDeal.route.js';
const debug = createDebug('api:Application');
const wsDebug = createDebug('api:WebSocket');

import {processBlockData} from './src/service/dataProcessor.service.js';
import { saveNewLogsService } from './src/service/latestLogs.service.js';
const boostrap = async () => {
  const app = express();
  const port = 3000;

  connectToMongoDb();

  // URL của node Besu với WebSocket (thay đổi theo cấu hình của bạn)
  const besuWsUrl = 'ws://127.0.0.1:8546'; // Đây là cổng WebSocket của Besu (thường là 8546)
  // Khởi tạo WebSocket client
  const ws = new WebSocket(besuWsUrl);

  // Hàm đăng ký để nhận thông báo khi có block mới
  function subscribeToNewBlocks() {
    const subscriptionMessage = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_subscribe",
      params: ["newHeads"], // Đăng ký nhận thông báo khi có block mới
      id: 1
    });

    ws.send(subscriptionMessage);
  }


  function getLogs() {
    const requestMessage = JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getLogs",
      params: [
        {
          fromBlock: "latest", 
          toBlock: "latest",  
          address: "0xbE80Fa520AD9EEB165565d42b66b549170D3aEf6",
          topics: [
            null,
            null,  
            null, 
            [
              '0x0000000000000000000000000000000000000000000000000000000000000001'  // Kiểm tra topic cuối cùng có giá trị này
            ]
          ]
        }
      ],
      id: 2
    });
    ws.send(requestMessage);
  }

  ws.on('open', () => {
    wsDebug("Connected to Besu WebSocket.");
    subscribeToNewBlocks();
  });

  ws.on('message', async (data) => {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData.method === 'eth_subscription' && parsedData.params.result) {
        const blockHash = parsedData.params.result.hash;
        console.log("New block detected with hash:", blockHash);
        

        getLogs();
      }

      // Kiểm tra nếu có logs
      if (parsedData.id === 2 && parsedData.result) {
        const logs = parsedData.result;
        if (logs && logs.length > 0) {
          console.log("Logs from the contract:", JSON.stringify(logs, null, 2));
          console.log(logs)
          //await saveNewLogsService(logs);
          // await processBlockData(logs);
        } else {
          console.log("No logs found for this block.");
        }
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

  app.use(cors());
  app.use(express.json());

  app.use('/api', blockRouter);
  app.use('/api', dealRouter);
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

boostrap();
