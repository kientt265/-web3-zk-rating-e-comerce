import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/database.js';
import connectBesu from './websocket/besu.js';

dotenv.config();

// Kết nối MongoDB
connectDB();

// Kết nối WebSocket tới Besu
connectBesu('ws://127.0.0.1:8546');

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
