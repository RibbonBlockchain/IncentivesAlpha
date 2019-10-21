import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ActivityListSchema = new Schema({
  activityTitle: {
    type: String,
    required: "Enter an interaction title"
  },
  activityDescription: {
    type: String,
    required: false
  },
  activityReward: {
    type: Number,
    required: "Interaction reward is required"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});
