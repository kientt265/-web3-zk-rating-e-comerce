import express from 'express';
import connectDB from './config/database.js';
import { getBlocks } from './controllers/blockController.js';

const app = express();
app.use(express.json());

// Route
app.get('/api/blocks', getBlocks);

export default app;
