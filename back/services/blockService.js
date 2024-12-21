import Block from '../models/block.js';

const processBlock = async (block) => {
    try {
        const blockData = {
            number: parseInt(block.number, 16),
            hash: block.hash,
            transactions: block.transactions,
            timestamp: new Date(parseInt(block.timestamp, 16) * 1000), // Chuyển timestamp
        };

        // Lưu vào MongoDB
        const newBlock = new Block(blockData);
        await newBlock.save();
        console.log("Block saved:", newBlock);
    } catch (err) {
        console.error("Error processing block:", err);
    }
};

export default processBlock;
