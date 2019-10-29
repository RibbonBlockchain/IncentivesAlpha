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
  nonce: {
    type: Number,
    required: "Nonce is required"
  },
  publicAddress: {
    type: String,
    required: true,
    index: { unique:true }
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
  phoneNumber: {
    type: String,
    required: "Please Enter a Mobile Number",
    index: { unique:true }
  },
  onBoardedBy:{
		type: Schema.ObjectId,
		ref: 'User',
	},
  createdDate: {
    type: Date,
    default: Date.now
  }
});
