import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const WalletSchema = new Schema({
  claimed: {
    type: Boolean,
    required: "Enter if the account has been claimed"
  },
  tenant: {
    type: String,
    required: "Enter a tenant name"
  },
  phone: {
    type: Number,
    required: "Enter a phone number"
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});
