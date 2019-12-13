import * as mongoose from "mongoose";
import { stringify } from "querystring";

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
  nonce: {
    type: Number,
    required: "Nonce is required"
  },
  publicAddress: {
    type: String,
    index: { unique: true }
  },
  role: {
    type: Number,
    required: "Enter a number between 0 and 4"
  },
  dateOfBirth: {
    type: Date,
    required: "Enter a valid Date"
  },
  idNumber: {
    type: String,
    required: "Enter a valid id number"
  },
  gender: {
    type: String
  },
  location: {
    type: String
  },
  title: {
    type: String
  },
  phoneNumber: {
    type: String,
    index: { unique: true }
  },
  onBoardedBy: {
    type: Schema.ObjectId,
    ref: "User"
  },
  minors:[
    {
        type: Schema.ObjectId,
        ref: "Minors"
    }
  ],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

// UserSchema.pre("find", autoPopulateForeigns);
// UserSchema.pre("findOne", autoPopulateForeigns);

// function autoPopulateForeigns(next) {
//   this.populate("minors", ["firstName", "lastName"])
//       .populate("onBoardedBy", ["firstName", "lastName", "publicAddress"])
//   next();

// }

