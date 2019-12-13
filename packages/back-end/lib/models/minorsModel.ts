import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const MinorsSchema = new Schema({
  relatedTo: {
    type: Schema.ObjectId,
    ref: "User"
  },
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
  role: {
    type: Number
  },
  idNumber: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
})

MinorsSchema.pre("find", autoPopulateForeigns);
MinorsSchema.pre("findOne", autoPopulateForeigns);

function autoPopulateForeigns(next) {
  this.populate("relatedTo", ["firstName", "lastName", "publicAddress", "location"])
  next();

}