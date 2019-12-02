import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const MinorsSchema = new Schema({
  firstName: {
    type: String,
    required: "Enter a user's first name"
  },
  lastName: {
    type: String,
    required: "Enter a user's last name"
  },
  dateOfBirth: {
    type: Date,
    required: "Enter a valid Date"
  },
  gender: {
    type: String
  },
  location: {
    type: String
  },
  idNumber: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})