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
  dealID: { type: String, required: true },
  proofMerkle: { type: [String], required: true }, // Mảng các chuỗi
  buyerAddress: { type: String, required: true },
});


const Data = mongoose.model('Data', dataSchema);

export default Data;
