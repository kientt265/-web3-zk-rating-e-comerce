import { getRequestService } from '../service/request.service.js';

export const getRequestController = async (req, res) => {
  try {
    const request = await getRequestService(req.params.dealId);
    res.status(200).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};