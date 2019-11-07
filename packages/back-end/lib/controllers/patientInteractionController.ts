import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import { Request, Response } from "express";
import * as moment from "moment";

const User = mongoose.model("User", UserSchema);

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class PatientInteractionListController {
  public async addPatientInteraction(req: Request, res: Response) {
    try {
      let newPatientInteraction = new patientInteractionList(req.body);

      await newPatientInteraction
        .save()
        .then(async interaction => {
          res.status(201).json({ status: 201, data: interaction });
        })
        .catch(error => {
          res.status(400).json({ status: 400, message: error });
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public async getAllPatientInteractions(req: Request, res: Response) {
    try {
      await patientInteractionList
        .find({})
        .then(async interactions => {
          res.json({ status: 200, data: interactions });
        })
        .catch(error => {
          res.status(404);
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public async getPatientInteractionByAddress(req: Request, res: Response) {
    try {
      if (parseInt(req.body.role) === 1) {
        if(req.query){
          const date_from = req.query['date_from'];
          const date_to = req.query['date_to'];
          const date = req.query['date'];
          const patient = req.query['patient_id'];
          const practitioner = req.query['practitioner_id'];
          const chw = req.query['chw_id'];
          let options = {};
          if(date_from){
              if(!options["createdDate"]) options["createdDate"] = {};
              const dateFrom = moment(new Date(date_from)).toDate();
              options["createdDate"]['$gte'] = dateFrom;
          }

          if(date_to){
              if(!options["createdDate"]) options["createdDate"] = {};
              const dateTo = moment(new Date(date_to)).toDate();
              options["createdDate"]['$lte'] = dateTo;
          }

          if(date) {
            if(!options["createdDate"]) options["createdDate"] = {};
            const dDate = moment(new Date(date)).toDate()
            options["createdDate"] = dDate
          }

          if(patient){
            if(!options["patient"]) options["patient"] = {};
            options["patient"] = patient;
          }

          if(practitioner){
            if(!options["practitioner"]) options["practitioner"] = {};
            options["practitioner"] = practitioner;
          }

          if(chw){
            if(!options["chw"]) options["chw"] = {};
            options["chw"] = chw;
          }

          console.log(options)

          await patientInteractionList
            .find(options)
            .then(async interactions => {
              res.json({status: 200, data: interactions})
            })
            .catch(error => {
              res.status(404)
            })
        }
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          await patientInteractionList
            .find({})
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            })
            .catch(error => {
              res.status(404);
            });
        });

      } else if (parseInt(req.body.role) === 2) {
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          await patientInteractionList
            .find({
              chw: user._id
            })
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            })
            .catch(error => {
              res.status(404);
            });
        });
      } else if (parseInt(req.body.role) === 3) {
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          await patientInteractionList
            .find({
              patient: user._id
            })
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            })
            .catch(error => {
              res.status(404);
            });
        });
      } else {
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          await patientInteractionList
            .find({
              practitioner: user._id
            })
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            })
            .catch(error => {
              res.status(404);
            });
        });
      }
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }
}
