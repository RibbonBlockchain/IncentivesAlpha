import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { Request, Response } from "express";

const User = mongoose.model("User", UserSchema);

export class UserController {
  public addNewUser(req: Request, res: Response) {
    let newUser = new User(req.body);

    newUser.save((err, user) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: user });
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
