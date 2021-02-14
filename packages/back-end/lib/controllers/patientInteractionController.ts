import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import {MinorsSchema} from "../models/minorsModel";
import { PatientInteractionSchema } from "../models/patientInteractionModel";
import {filters} from "./helpers/helpers"
import { Request, Response } from "express";

const User = mongoose.model("User", UserSchema);

const Minors = mongoose.model("Minors", MinorsSchema);

const patientInteractionList = mongoose.model(
  "InteractionList",
  PatientInteractionSchema
);

export class PatientInteractionListController {
 
  public async addPatientInteraction(req: Request, res: Response) {
    try {
      let interaction_data = req.body
      let patient: any = {
        _id: "",
        firstName: "",
        lastName: "",
        publicAddress: ""
      }
      try{
        await User.findOne(
          {
            _id: req.body.patient
          }
        ).then(async (user : any) => {
          patient._id = req.body.patient,
          patient.firstName = user.firstName,
          patient.lastName = user.lastName,
          patient.publicAddress= user.publicAddress
        })
      }catch{
        await Minors.findOne(
          {
            _id: req.body.patient
          }
        ).then(async (minor: any) => {
          patient._id = req.body.patient,
          patient.firstName = minor.firstName,
          patient.lastName = minor.lastName
        })
      }

      interaction_data.patient = patient

      let newPatientInteraction = new patientInteractionList(interaction_data);

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
          let options = filters(req.query)

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
        if(req.query){
          let options = filters(req.query)
          await User.findOne({
            publicAddress: req.params.userAddress
          }).then(async user => {
            options["chw"] = user._id
            await patientInteractionList
              .find(options)
              .then(async interactions => {
                res.json({ status: 200, data: interactions });
              })
              .catch(error => {
                res.status(404)
              })
          })
        }
        
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
        if(req.query){
          let options = filters(req.query)
          await User.findOne({
            publicAddress: req.params.userAddress
          }).then(async user => {
            options["patient._id"] = user._id
            await patientInteractionList
              .find(options)
              .then(async interactions => {
                res.json({ status: 200, data: interactions });
              })
              .catch(error => {
                res.status(404)
              })
          })
        }
        
        await User.findOne({
          publicAddress: req.params.userAddress
        }).then(async user => {
          await patientInteractionList
            .find({
              patient: {_id: user._id}
            })
            .then(async interactions => {
              res.json({ status: 200, data: interactions });
            })
            .catch(error => {
              res.status(404);
            });
        });
      } else {
        if(req.query){
          let options = filters(req.query)
          await User.findOne({
            publicAddress: req.params.userAddress
          }).then(async user => {
            options["practitioner"] = user._id
            await patientInteractionList
              .find(options)
              .then(async interactions => {
                res.json({ status: 200, data: interactions });
              })
              .catch(error => {
                res.status(404)
              })
          })
        }

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
