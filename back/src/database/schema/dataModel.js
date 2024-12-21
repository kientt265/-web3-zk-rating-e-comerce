import mongoose from 'mongoose';

// BlockNumber
// TransactionHash
// ProductID
// ProofMerkle
// ProvingKey
// TimeStamp
// BuyerAddress

const dataSchema = new mongoose.Schema({
  blockNumber: { type: Number, required: true },
  transactionHash: { type: String, required: true },
  hash: { type: String, required: true },
  productID: { type: String, required: true },
  proofMerkle: { type: String, required: true },
  provingKey: { type: String, required: true },
  buyerAddress: { type: String, required: true },
  timestamp: { type: Date, required: true },

}, { timestamps: true });

const Data = mongoose.model('Data', dataSchema);

export default Data;
