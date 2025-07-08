import Rating from '../database/schema/ratingModel.js';

export const saveRatingService = async ({ productId, rating, comment, images }) => {
  const ratingDoc = new Rating({
    productId,
    rating,
    comment,
    images,
  });
  await ratingDoc.save();
  return ratingDoc;
};