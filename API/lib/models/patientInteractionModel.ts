import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PatientInteractionSchema = new Schema({
    patientId: {
        type: Number,
        required: "Enter a patient id"
    },
    practitionerId: {
        type: Number,
        required: "Enter a practitioner id"
    },
    activities: [
        {
            activityId: {
                type: Number,
                required: "Enter a valid activity id"
            }
        }
    ],
    prescriptions: [
        {
            prescriptionId: {
                type: Number,
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
    serviceRatings: {
        type: Number,
        required: "Enter a service rating"
    },
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