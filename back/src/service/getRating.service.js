import Data from '../database/schema/ratingModel.js'



export const getRatingService = async (productId) => {
  // Lấy tất cả đánh giá của productId
  const data = await Data.find({ productId: productId }); 
  // Trả về mảng các object chỉ chứa rating, comment, images
  return data.map(({ rating, comment, images }) => ({ rating, comment, images }));
}
