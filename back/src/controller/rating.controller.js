import {getRatingService} from '../service/getRating.service.js';

export const getRatingsController = async (req, res) => {
  try {
    const ratings = await getRatingService(req.params.productId);
    res.status(200).json(ratings);
  } catch (error) { // Thay err bằng error
    res.status(500).json({ message: error.message });
  }
};