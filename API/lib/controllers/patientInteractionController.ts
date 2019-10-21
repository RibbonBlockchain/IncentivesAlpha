import * as mongoose from "mongoose";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import { Request, Response } from "express";

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class PatientInteractionListController {
  public async addPatientInteraction(req: Request, res: Response) {
    try{
      let newPatientInteraction = new patientInteractionList(
          req.body
          );

      await newPatientInteraction.save().then(
        async interaction => {
          res.status(201).json({ status: 201, data: interaction });
        }
      ).catch(error => {
        res.status(400).json({status:400, message:error})
      })
    }catch{
      res.status(500).json({status:500, message:"Server Error"})
    }
  }

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