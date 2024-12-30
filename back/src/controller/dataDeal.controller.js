import {processBlockData} from '../service/dataProcessor.service.js';

export const saveNewDealIdController = async (req, res) => {
    try {
      const newDealId = await processBlockData(req.body);
      res.status(200).json(newDealId);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  