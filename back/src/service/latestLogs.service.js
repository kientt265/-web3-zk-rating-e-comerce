import LastLogData from '../database/schema/lastestLogsModel.js';
// import { processBlockData } from './dataProcessor.service.js';

const saveNewLogsService = async (logs) => {

  try {

    // const processedData = processBlockData(logs);
    const newBlock = new LastLogData(logs);
    await newBlock.save();

    console.log("New logs saved:", logs);
    return newBlock;
  } catch (error) {
    console.error("Error saving block:", error);
    throw error;
  }
};

export { saveNewLogsService };  