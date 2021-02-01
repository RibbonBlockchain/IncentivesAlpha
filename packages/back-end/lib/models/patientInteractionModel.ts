import * as mongoose from "mongoose";
import { FKHelper } from "./helpers/foreign-key-helper";

const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

export const PatientInteractionSchema = new Schema({
  patient: {
    _id: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    publicAddress: {
      type: String
    }
  },
  practitioner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  chw: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  activities: [
    {
      type: Schema.Types.ObjectId,
      ref: "ActivityList"
    }
  ],
  prescriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "PrescriptionList"
    }
  ],
  prescriptionNo: {
    type: String
  },
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
  transactionLog: {
      txn_hash: {
        type: String,
        required: "A transaction address is required"
      },
      txn_amount: {
        type: Number,
        required: "Enter a transaction amount"
      },
      status: {
        type: Number,
        default: 0
      }
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

PatientInteractionSchema.plugin(AutoIncrement, {inc_field: 'counter'});

PatientInteractionSchema.pre("find", autoPopulateForeigns);
PatientInteractionSchema.pre("findOne", autoPopulateForeigns);

function autoPopulateForeigns(next) {
  this.populate("activities", ["activityTitle"])
    .populate("prescriptions", ["prescriptionTitle"])
    .populate("chw", ["firstName", "lastName", "publicAddress"])
    .populate("practitioner", ["firstName", "lastName", "publicAddress"]);
  next();
}
