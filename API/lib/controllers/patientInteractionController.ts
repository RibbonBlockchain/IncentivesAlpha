import * as mongoose from "mongoose";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import { Request, Response } from "express";

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class PatientInteractionListController {
//   public async addActivity(req: Request, res: Response) {
//     try{
//       let newActivity = new activityList(req.body);

//       await newActivity.save().then(
//         async activity => {
//           res.status(201).json({ status: 201, data: activity });
//         }
//       ).catch(error => {
//         res.status(400).json({status:400, message:"Bad request, please check your request body"})
//       })
//     }catch{
//       res.status(500).json({status:500, message:"Server Error"})
//     }
//   }

  public async getAllPatientInteractions(req: Request, res: Response) {
    try{
      await patientInteractionList.find({

      }).then(async interactions => {
        res.json({ status: 200, data: interactions });
      }).catch(error => {
        res.status(404)
      })
    }catch{
      res.status(500).json({status:500, message:"Server Error"})
    }
  }
}