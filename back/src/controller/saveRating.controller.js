import { saveRatingService } from '../service/saveRating.service.js';

export const saveRatingController = async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;
    if (!productId || rating === undefined) {
      return res.status(400).json({ success: false, message: 'productId and rating are required.' });
    }
    const result = await saveRatingService({ productId, rating, comment, images });
    res.status(201).json({ success: true, message: 'Rating saved successfully.', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};