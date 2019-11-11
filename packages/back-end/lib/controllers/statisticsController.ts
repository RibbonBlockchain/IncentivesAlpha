import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { PatientInteractionSchema } from "../models/patientInteractionModel";

const User = mongoose.model("User", UserSchema);

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class StatisticsController {
    
}