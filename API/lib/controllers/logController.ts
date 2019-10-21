import * as mongoose from "mongoose";
import { LogSchema } from "../models/blockchainLogModel";
import { Request, Response } from "express";

const log = mongoose.model(
  "log",
  LogSchema
);

export class LogController {
  public addNewLog(req: Request, res: Response) {
    let newLog = new log(req.body);

    newLog.save((err, newlog) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: newlog });
    });
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
