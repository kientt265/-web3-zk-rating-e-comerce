import mongoose from "mongoose";

const LastestLogSchema = new mongoose.Schema({
  logIndex: { type: String, required: true },
  removed: { type: Boolean, required: true },
  blockNumber: { type: String, required: true },
  blockHash: { type: String, required: true },
  transactionHash: { type: String, required: true },
  transactionIndex: { type: String, required: true },
  address: { type: String, required: true },
  data: { type: String, required: true },
  topics: { type: [String], required: true },
});

const LogDataSchema = new mongoose.Schema({
  Logsfromthecontract: { type: [LogSchema], default: [] },
});

const LogData = mongoose.model("LogData", LogDataSchema);

export default LogData;
