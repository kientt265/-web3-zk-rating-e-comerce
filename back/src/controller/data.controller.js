import { saveNewBlockService } from '../service/latestBlock.service.js';

export const saveNewBlockController = async (req, res) => {
  try {
    const newBlock = await saveNewBlockService(req.body);
    res.status(200).json(newBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
