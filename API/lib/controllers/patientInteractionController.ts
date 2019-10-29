import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import { Request, Response } from "express";


const User = mongoose.model(
  "User", 
  UserSchema
);

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

  public async getPatientInteractionByAddress(req: Request, res: Response) {
    try{
      if(parseInt(req.body.role)===1){
        await User.findOne({
          publicAddress: 
          req.params.userAddress
        }).then(
          async user => {
            await patientInteractionList.find({

            })
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            }).catch(error => {
              res.status(404)
            })
          }
        )
      }else if(parseInt(req.body.role)===2){
        await User.findOne({
          publicAddress: 
          req.params.userAddress
        }).then(
          async user => {
            await patientInteractionList.find({
              chwAddress: user._id
            }).then(async interactions => {
              res.json({ status: 200, data: interactions });
            }).catch(error => {
              res.status(404)
            })
          }
        )
      }else if(parseInt(req.body.role)===3){
        await User.findOne({
          publicAddress: 
          req.params.userAddress
        }).then(
          async user => {
            await patientInteractionList.find({
              patientAddress: user._id
            }).then(async interactions => {
              res.json({ status: 200, data: interactions });
            }).catch(error => {
              res.status(404)
            })
          }
        )
      }else{
        await User.findOne({
          publicAddress: 
          req.params.userAddress
        }).then(
          async user => {
            await patientInteractionList.find({
              practitionerAddress: user._id
            }).then(async interactions => {
              res.json({ status: 200, data: interactions });
            }).catch(error => {
              res.status(404)
            })
          }
        )
      }
    }catch{
      res.status(500).json({status:500, message:"Server Error"})
    }
  }
}