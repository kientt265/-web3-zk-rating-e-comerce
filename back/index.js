import createDebug from 'debug';
import WebSocket from 'ws';
import express from 'express';
import cors from 'cors';
import connectToMongoDb from './mongoDb.js';

import blockRouter from './src/routes/data.route.js';
import dealRouter from './src/routes/dataDeal.route.js';
import requestRouter from './src/routes/request.route.js';

const debug = createDebug('api:Application');
const wsDebug = createDebug('api:WebSocket');

import { processBlockData } from './src/service/dataProcessor.service.js';
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
      //chay lai
  
      // Kiểm tra nếu có logs
      if (parsedData.id === 2 && parsedData.result) {
        const logs = parsedData.result;
        if (logs && logs.length > 0) { 
          // console.log("Logs from the contract:", JSON.stringify(logs, null, 2));
          console.log(logs[0])
          await saveNewLogsService(logs[0]); 
          await processBlockData(logs[0]);   // bay gio cai nay no la 1 object 
          // ma cai logsBlockData.map no la 1 array
          // hieu k 
          // ko can map nua 
        } else {
          console.log("No logs found for this block.");
        } //chay lai 
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    } //chay lai de xem cai log thoi/ 
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
  app.use('/api', requestRouter);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

boostrap();
// no dang la cai array ne/ e thay kh, nen ko map dc schema
// bay gio neu chac chan la chi co 1 item trong casi arrray
// thi gan no la item dau tien luon
// logs[0]

// [
//   {
//     logIndex: '0x0',
//     removed: false,
//     blockNumber: '0x9f',
//     blockHash: '0x3ad95841e05197a21f14ec64c8e393c02a0855b8de65179babd835ee2774cd69',
//     transactionHash: '0xc26b34c8f7395d7f29ab2be10ba8b5f866df35acb001b307b26a1921e5582262',
//     transactionIndex: '0x0',
//     address: '0xbe80fa520ad9eeb165565d42b66b549170d3aef6',
//     data: '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000429d069189e000000000000000000000000000000000000000000000000000000000000000000067175616e30320000000000000000000000000000000000000000000000000000',
//     topics: [
//       '0x8918c83aa5f8ab19a05a1213d550056b84f07e9ff53eda6cdc1344641fca869d',
//       '0x000000000000000000000000000000000000000000000000000000000000002a',
//       '0x0000000000000000000000002bef6298f46817f7391a852dfc6669492ea72d90',
//       '0x0000000000000000000000000000000000000000000000000000000000000001'
//     ]
//   }
// ]