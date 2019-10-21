import * as mongoose from "mongoose";
import { LogSchema } from "../models/blockchainLogModel";
import { Request, Response } from "express";

const log = mongoose.model(
  "log",
  LogSchema
);

export class LogController {
  public addNewLog(req: Request, res: Response) {
    try{
        let newLog = new log(req.body);

        newLog.save((err, newlog) => {

        res.status(200).json({ status: 200, data: newlog });
        });
    }catch{
        res.status(400).json({status:400, message:"Duplicate Transaction hash"})
    }
  }

  public getAllLogs(req: Request, res: Response) {
    log.find({ txn_address: req.params.txn_address }, (err, address) => {
        if (err) {
          res.send(err);
        }
        res.json({ status: 200, data: address });
      });
    }

//   public updateInteractionDetails(req: Request, res: Response) {
//     interactionList.updateOne(
//       { interactionId: req.params.interactionId },
//       {
//         $set: {
//           interactionReward: req.body.interactionReward
//         }
//       },
//       (err, interaction) => {
//         if (err) {
//           res.send(err);
//         }
//         res.json({ status: 200, data: interaction });
//       }
//     );
//   }
}
