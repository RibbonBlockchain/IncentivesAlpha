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
    index: { unique: true }
  },
  role: {
    type: Number,
    required: "Enter a number between 0 and 3"
  },
  category: {
    type: Number,
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
  relatedTo: {
    type: Schema.ObjectId,
    ref: "User"
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("find", autoPopulateForeigns);
UserSchema.pre("findOne", autoPopulateForeigns);

function autoPopulateForeigns(next) {
  this.populate("relatedTo", ["firstName", "lastName", "publicAddress"])
    .populate("onBoardedBy", ["firstName", "lastName", "publicAddress"])
  next();

}

