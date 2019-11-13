import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const RatingsSchema = new Schema({
    ratingsTitle: {
        type: String,
        required: "Enter a ratings Title"
    },
    ratingsDescription: {
        type: String
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})