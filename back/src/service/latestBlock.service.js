import LatestBlock from '../database/schema/latestBlockModel.js';
import { processBlockData } from './dataProcessor.service.js';

const saveNewBlockService = async (block) => {

  try {
    // Điều chế dữ liệu trước khi lưu
    const processedData = processBlockData(block);

    // Lưu vào MongoDB
    const newBlock = new LatestBlock(block);
    await newBlock.save();

    console.log("New block saved:", block);
    return newBlock;
  } catch (error) {
    console.error("Error saving block:", error);
    throw error;
  }
};

export { saveNewBlockService };  