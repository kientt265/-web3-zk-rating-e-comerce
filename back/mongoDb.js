import mongoose from 'mongoose';
import 'dotenv/config'

const uri = process.env.MONGO_URI;

async function connectToMongoDb() {

  if (!uri) {
    console.error('Mongo URI is not defined in .env');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Failed to connect to MongoDB:', err);
  }
}

export default connectToMongoDb;