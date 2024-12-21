import LatestBlock from '../database/schema/latestBlockModel.js';

const saveNewBlockService = async (block) => {

  const newBlock = new LatestBlock(block);
  await newBlock.save();

};

export { saveNewBlockService };  