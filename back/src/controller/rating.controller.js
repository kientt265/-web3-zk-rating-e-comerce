import Rating from '../database/schema/ratingModel.js';

export const getRatingsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await Rating.find({ productId }).sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};