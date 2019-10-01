import * as mongoose from "mongoose";
import { InteractionListSchema } from "../models/interactionListModel";
import { Request, Response } from "express";

const interactionList = mongoose.model(
  "InteractionList",
  InteractionListSchema
);

export class InteractionListController {
  public addInteraction(req: Request, res: Response) {
    let newInteraction = new interactionList(req.body);

    newInteraction.save((err, interaction) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: interaction });
    });
  }

  public getAllInteractionLists(req: Request, res: Response) {
    interactionList.find({}, (err, interactions) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: interactions });
    });
  }

  //   public updateInteractionDetails(req: Request, res: Response) {
  //     interactionList.updateOne(
  //       { publicAddress: req.params.userAddress },
  //       {
  //         $set: {
  //           firstName: req.body.firstName,
  //           lastName: req.body.lastName
  //         }
  //       },
  //       (err, user) => {
  //         if (err) {
  //           res.send(err);
  //         }
  //         res.json({ status: 200, data: user });
  //       }
  //     );
  //   }
}
