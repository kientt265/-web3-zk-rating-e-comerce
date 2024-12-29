import dotenv from 'dotenv';

// Tải các biến môi trường từ file .env
const result = dotenv.config();
console.log(result);
// Ví dụ sử dụng biến môi trường
console.log(process.env.URL_RPC_INFURA);
console.log(process.env.PRIVATE_KEY_ADMIN);
