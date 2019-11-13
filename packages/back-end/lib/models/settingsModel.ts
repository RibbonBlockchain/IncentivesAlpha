import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const SettingsSchema = new Schema({
  patientPercentage: {
    type: Number,
    required: "Patient percentage is required"
  },
  practitionerPercentage: {
    type: Number,
    required: "Practitioner percentage is required"
  },
  chwPercentage: {
    type: Number,
    required: "chw percentage is required"
  },
  ratingTypes: [
    {
      title: String
    }
  ]
});
