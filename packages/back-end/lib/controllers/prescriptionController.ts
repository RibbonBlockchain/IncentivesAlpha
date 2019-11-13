import * as mongoose from "mongoose";
import { PrescriptionListSchema } from "../models/prescriptionModel";
import { Request, Response } from "express";

const prescriptionList = mongoose.model(
  "PrescriptionList",
  PrescriptionListSchema
);

export class PrescriptionListController {
  public async addPrescription(req: Request, res: Response) {
    try {
      let newPrescription = new prescriptionList(req.body);

      await newPrescription
        .save()
        .then(async prescription => {
          res.status(201).json({ status: 201, data: prescription });
        })
        .catch(error => {
          res
            .status(400)
            .json({
              status: 400,
              message: "Bad request, please check your request body"
            });
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public async getAllPrescriptions(req: Request, res: Response) {
    try {
      await prescriptionList
        .find({})
        .then(async prescriptions => {
          res.json({ status: 200, data: prescriptions });
        })
        .catch(error => {
          res.status(404);
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }
}
