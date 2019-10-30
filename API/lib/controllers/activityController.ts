import * as mongoose from "mongoose";
import { ActivityListSchema } from "../models/activityListModel";
import { Request, Response } from "express";

const activityList = mongoose.model(
  "ActivityList",
  ActivityListSchema
);

export class ActivityListController {
  public async addActivity(req: Request, res: Response) {
    try{
      let newActivity = new activityList(req.body);

      await newActivity.save().then(
        async activity => {
          res.status(201).json({ status: 201, data: activity });
        }
      ).catch(error => {
        res.status(400).json({status:400, message:"Bad request, please check your request body"})
      })
    }catch{
      res.status(500).json({status:500, message:"Server Error"})
    }
  }

  public async getAllActivities(req: Request, res: Response) {
    try{
      await activityList.find({

      }).then(async activities => {
        res.json({ status: 200, data: activities });
      }).catch(error => {
        res.status(404)
      })
    }catch{
      res.status(500).json({status:500, message:"Server Error"})
    }
  }

  // public updateInteractionDetails(req: Request, res: Response) {
  //   interactionList.updateOne(
  //     { interactionId: req.params.interactionId },
  //     {
  //       $set: {
  //         interactionReward: req.body.interactionReward
  //       }
  //     },
  //     (err, interaction) => {
  //       if (err) {
  //         res.send(err);
  //       }
  //       res.json({ status: 200, data: interaction });
  //     }
  //   );
  // }
}
