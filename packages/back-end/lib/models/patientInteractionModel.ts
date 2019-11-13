import * as mongoose from "mongoose";
import { FKHelper } from "./helpers/foreign-key-helper";

const Schema = mongoose.Schema;

export const PatientInteractionSchema = new Schema({
  patient: {
    type: Schema.ObjectId,
    ref: "User"
  },
  practitioner: {
    type: Schema.ObjectId,
    ref: "User"
  },
  chw: {
    type: Schema.ObjectId,
    ref: "User"
  },
  activities: [
    {
      type: Schema.ObjectId,
      ref: "ActivityList"
    }
  ],
  prescriptions: [
    {
      type: Schema.ObjectId,
      ref: "PrescriptionList"
    }
  ],
  rewards: [
    {
      patientReward: {
        type: Number,
        required: "Enter a patient reward"
      },
      practitionerReward: {
        type: Number,
        required: "Enter a practitioner reward"
      },
      chwReward: {
        type: Number,
        required: "Enter a chw reward"
      }
    }
  ],
  serviceRatings: [],
  transactionLogs: [
    {
      paying_address: {
        type: String,
        required: "A transaction address is required"
      },
      recepient_address: {
        type: String,
        required: "A transaction address is required"
      },
      txn_hash: {
        type: String,
        required: "A transaction address is required"
      },
      txn_date: {
        type: Date,
        required: "Enter a transaction valid Date"
      },
      txn_amount: {
        type: Number,
        required: "Enter a transaction amount"
      },
      status: {
        type: Number,
        default: 0
      }
    }
  ],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

PatientInteractionSchema.pre("find", autoPopulateForeigns);
PatientInteractionSchema.pre("findOne", autoPopulateForeigns);

function autoPopulateForeigns(next) {
  this.populate("activities", ["activityTitle"])
    .populate("prescriptions", ["prescriptionTitle"])
    .populate("patient", ["firstName", "lastName", "publicAddress"])
    .populate("chw", ["firstName", "lastName", "publicAddress"])
    .populate("practitioner", ["firstName", "lastName", "publicAddress"]);
  next();
}
