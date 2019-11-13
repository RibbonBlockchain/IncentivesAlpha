import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import { Request, Response } from "express";
import { parseSignature } from "ethers/utils";

const User = mongoose.model("User", UserSchema);

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class StatisticsController {
  public async getStatistics(req: Request, res: Response) {
    try{
      let stats = {}
      let userId 
      if(parseInt(req.body.role) === 1){
        await User.count({
          role: 2
        }).then(async chws => {
          stats["chw_count"] = chws
        }).catch(error => {
          stats["chw_count"] = 0
        })

        await User.count({
          role: 3
        }).then(async patients => {
          stats["patient_count"] = patients
        }).catch(error => {
          stats["patient_count"] = 0
        })

        await User.count({
          role: 4
        }).then(async practitioners => {
          stats["practitioner_count"] = practitioners
        }).catch(error => {
          stats["practitioner_count"] = 0
        })

        res.status(200).json({status:200, data: stats})

      }else if (parseInt(req.body.role) ===2) {

        await User.count({
          role: 3
        }).then(async patients => {
          stats["patient_count"] = patients
        }).catch(error => {
          stats["patient_count"] = 0
        })

        await User.count({
          role: 4
        }).then(async practitioners => {
          stats["practitioner_count"] = practitioners
        }).catch(error => {
          stats["practitioner_count"] = 0
        })

        await patientInteractionList.aggregate([
          {
            $group: {
              _id: null,
              "Total Amount": {
                $sum: "chwReward"
              }
            }
          }
        ]).then(async total => {
          stats["amount_earned"] = total
        })

        res.status(200).json({status:200, data: stats})

      }else if (parseInt(req.body.role) === 3){

        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          userId = user._id
        })

        await patientInteractionList.aggregate([
          {
            $match : {
              patient: userId
            }
          },
          {
            $group : {
              _id: null,
              count: {$sum: 1}
            }
          }
        ]).then(async visits => {
          if(visits.length === 0){
            stats["visits"] = 0
          }
          else{
            stats["visits"] = visits[0].count
          }
        })

        res.status(200).json({status:200, data: stats})

      }else if (parseInt(req.body.role) === 4){
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          userId = user._id
          console.log(userId)
        })

        await patientInteractionList.aggregate([
          {
            $match : {
              practitioner: userId
            }
          },
          {
            $group : {
              _id: null,
              count: {$sum: 1}
            }
          }
        ]).then(async visits => {
          if(visits.length === 0){
            stats["visits"] = 0
          }
          else{
            stats["visits"] = visits[0].count
          }
        })

        res.status(200).json({status:200, data: stats})
      }

    }catch{
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }
}