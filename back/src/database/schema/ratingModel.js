import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: false },
  images: {type: String, required: false}, // Assuming images are stored as a string (e.g., URL or base64)
  timestamp: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;