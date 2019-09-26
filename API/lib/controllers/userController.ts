import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { mapUserDataToResponse } from "../serializers/userDataSerializer";
import { Request, Response } from "express";

const User = mongoose.model("User", UserSchema);

export class UserController {
  public addNewUser(req: Request, res: Response) {
    let form_data = req.body;
    //add required nonce field for login challenge
    let nonce = Math.floor(Math.random() * 1000000);
    form_data.nonce = nonce;
    let newUser = new User(form_data);

    newUser.save((err, user) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: mapUserDataToResponse(user) });
    });
  }

  public getUsers(req: Request, res: Response) {
    User.find({}, (err, users) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: users });
    });
  }

  //   public getWalletWithID(req: Request, res: Response) {
  //     Wallet.findById(req.params.walletId, (err, wallet) => {
  //       if (err) {
  //         res.send(err);
  //       }
  //       res.json(wallet);
  //     });
  //   }
}
