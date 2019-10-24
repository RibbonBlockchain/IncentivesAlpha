import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  txn_address: {
    type: String,
    required: "A transaction address is required"
  },
  txnHash: {
    type: String,
    required: "A transaction hash is required"
  },
  txn_date: {
    type: Date,
    required: "Enter a transaction valid Date"
  },
  status: {
    type: Number,
    default: 1
  }
});
