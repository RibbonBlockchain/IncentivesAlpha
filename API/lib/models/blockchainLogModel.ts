import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const LogSchema = new Schema({
  txn_address: {
    type: String,
    required: "A transaction address is required"
  },
  txn_hash: {
    type: String,
    required: "A transaction hash is required",
    index: { unique:true }
  },
  txn_date: {
    type: Date,
    required: "Enter a transaction valid Date"
  },
  txn_amount: {
    type: Number,
    required: "Enter a valid transaction amount"
  },
  status: {
    type: Number,
    default: 0
  }
});
