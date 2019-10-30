import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PrescriptionListSchema = new Schema({
  prescriptionTitle: {
    type: String,
    required: "Enter a prescription title"
  },
  prescriptionDescription: {
    type: String,
    required: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});