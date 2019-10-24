import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PatientInteractionSchema = new Schema({
    patientAddress: {
        type: String,
        required: "Enter a patient Address"
    },
    practitionerAddress: {
        type: String,
        required: "Enter a practitioner Address"
    },
    chwAddress:{
        type: String,
        required: "Enter a chw Address"
    },
    activities: [
        {
            activityId: {
                type: String,
                required: "Enter a valid activity id"
            }
        }
    ],
    prescriptions: [
        {
            prescriptionId: {
                type: String,
                required: "Enter a valid prescription id"
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