import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const InteractionListSchema = new Schema({
  interactionTitle: {
    type: String,
    required: "Enter an interaction title"
  },
  interactionDescription: {
    type: String,
    required: false
  },
  interactionReward: {
    type: Number,
    required: "Interaction reward is required"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});
