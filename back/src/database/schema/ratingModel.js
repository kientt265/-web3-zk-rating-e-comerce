import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  dealId: { type: String, required: true },
  productId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: false },
  images: [{ type: String }], // Array of image URLs
  timestamp: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;