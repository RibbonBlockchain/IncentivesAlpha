import * as mongoose from "mongoose";
import {FKHelper} from "./helpers/foreign-key-helper";

const Schema = mongoose.Schema;

export const PatientInteractionSchema = new Schema({
    patientAddress: [{
		type: Schema.ObjectId,
		ref: 'User',
	}],
    practitionerAddress: [{
		type: Schema.ObjectId,
		ref: 'User',
	}],
    chwAddress:[{
		type: Schema.ObjectId,
		ref: 'User',
	}],
    activities: [
        {
            activityId: {
                type: Schema.ObjectId,
		        ref: 'ActivityList',
            }
        }
    ],
    prescriptions: [
        {
            prescriptionId: {
                type: Schema.ObjectId,
		        ref: 'PrescriptionList',
            }
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
    serviceRatings: [
      {
            health_services: {
                type: Number,
                required: "Enter health services rating"
            },
            medicines: {
                type: Number,
                required: "Enter medicines rating"
            },
            patient_safety: {
                type: Number,
                required: "Enter patient safety rating"
            },
            cleanliness: {
                type: Number,
                required: "Enter cleanliness rating"
            },
            staff_attitude: {
                type: Number,
                required: "Enter staff attitude rating"
            },
            waiting_time: {
                type: Number,
                required: "Enter waiting time rating"
            }
      }
    ],
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
    ]
})

PatientInteractionSchema.pre('find', autoPopulateForeigns)
PatientInteractionSchema.pre('findOne', autoPopulateForeigns)

function autoPopulateForeigns (next) {
  this.populate('activityId')
  .populate('prescriptionId')
  .populate('patientAddress', ['firstName', 'lastName', 'publicAddress'])
  .populate('chwAddress', ['firstName', 'lastName', 'publicAddress'])
  .populate('practitionerAddress', ['firstName', 'lastName', 'publicAddress'])
  next()
}