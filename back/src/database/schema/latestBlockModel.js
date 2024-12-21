import mongoose from "mongoose";

const LatestBlockSchema = new mongoose.Schema({
  number: { type: String, required: true },
  hash: { type: String, required: true },
  mixHash: { type: String, required: true },
  parentHash: { type: String, required: true },
  nonce: { type: String, required: true },
  sha3Uncles: { type: String, required: true },
  logsBloom: { type: String, required: true },
  transactionsRoot: { type: String, required: true },
  stateRoot: { type: String, required: true },
  receiptsRoot: { type: String, required: true },
  miner: { type: String, required: true },
  difficulty: { type: String, required: true },
  totalDifficulty: { type: String, required: true },
  extraData: { type: String, required: true },
  size: { type: String, required: true },
  gasLimit: { type: String, required: true },
  gasUsed: { type: String, required: true },
  timestamp: { type: String, required: true },
  uncles: { type: [String], default: [] },
  transactions: {
    type: [
      {
        blockHash: { type: String, required: true },
        blockNumber: { type: String, required: true },
        chainId: { type: String, required: true },
        from: { type: String, required: true },
        gas: { type: String, required: true },
        gasPrice: { type: String, required: true },
        hash: { type: String, required: true },
        input: { type: String, required: true },
        nonce: { type: String, required: true },
        to: { type: String, required: true },
        transactionIndex: { type: String, required: true },
        type: { type: String, required: true },
        value: { type: String, required: true },
        v: { type: String, required: true },
        r: { type: String, required: true },
        s: { type: String, required: true },
      }
    ], default: []
  },
});

const LatestBlock = mongoose.model('LatestBlock', LatestBlockSchema);

export default LatestBlock;
