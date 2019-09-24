import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  firstName: {
    type: String,
    required: "Enter a user's first name"
  },
  lastName: {
    type: String,
    required: "Enter a user's last name"
  },
  walletAddress: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: "Enter a number between 0 and 3"
  },
  dateOfBirth: {
    type: Date,
    required: "Enter a valid Date"
  },
  idNumber: {
    type: String,
    required: "Enter a valid id number"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});
