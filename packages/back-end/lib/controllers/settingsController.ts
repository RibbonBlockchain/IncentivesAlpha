import * as mongoose from "mongoose";
import { SettingsSchema } from "../models/settingsModel";
import { Request, Response } from "express";

const settings = mongoose.model("Settings", SettingsSchema);

export class SettingsController {
  public async addSettings(req: Request, res: Response) {
    try {
      let newSetting = new settings(req.body);

      await newSetting
        .save()
        .then(async setting => {
          res.status(201).json({ status: 201, data: setting });
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

  public async getSettings(req: Request, res: Response) {
    try {
      await settings
        .find({})
        .then(async settings => {
          res.json({ status: 200, data: settings });
        })
        .catch(error => {
          res.status(404);
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public async getExchangeRate(req: Request, res: Response){
    try {
      await settings
        .find({})
        .then(async settings => {
          res.json({ status: 200, data: settings[0]['exchangeRateUSDZAR'] });
        })
        .catch(error => {
          res.status(404);
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }
}
