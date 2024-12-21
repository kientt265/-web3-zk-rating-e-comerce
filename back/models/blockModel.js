import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
    number: { type: Number, required: true },
    hash: { type: String, required: true },
    transactions: { type: Array, default: [] },
    timestamp: { type: Date, required: true },
}, { timestamps: true });

const Block = mongoose.model('Block', blockSchema);

export default Block;
