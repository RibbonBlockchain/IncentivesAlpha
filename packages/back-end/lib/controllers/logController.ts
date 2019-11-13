import * as mongoose from "mongoose";
import { LogSchema } from "../models/blockchainLogModel";
import { Request, Response } from "express";

const log = mongoose.model("log", LogSchema);

export class LogController {
  public async addNewLog(req: Request, res: Response) {
    try {
      let newLog = new log(req.body);

      await newLog
        .save(newLog)
        .then(async newlog => {
          res.status(201).json({ status: 201, data: newlog });
        })
        .catch(error => {
          res
            .status(400)
            .json({
              status: 400,
              message: "Bad Request, duplicate transaction hash"
            });
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public async getAllLogs(req: Request, res: Response) {
    try {
      await log
        .find({
          txn_address: req.params.txn_address
        })
        .then(async logs => {
          res.json({ status: 200, data: logs });
        })
        .catch(error => {
          res.status(404).json({ status: 404, message: "Address not found" });
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }
}
