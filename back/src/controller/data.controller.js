import { saveNewLogsService } from '../service/latestLogs.service.js';

export const saveNewLogsController = async (req, res) => {
  try {
    const newBlock = await saveNewLogsService(req.body);
    res.status(200).json(newBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
