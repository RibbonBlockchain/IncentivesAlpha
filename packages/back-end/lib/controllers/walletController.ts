import * as mongoose from "mongoose";
import { WalletSchema } from "../models/walletModel";
import { Request, Response } from "express";

const Wallet = mongoose.model("Wallet", WalletSchema);

export class WalletController {
  public addNewWallet(req: Request, res: Response) {
    let newWallet = new Wallet(req.body);

    newWallet.save((err, wallet) => {
      if (err) {
        res.send(err);
      }
      res.json(wallet);
    });
  }

  public getWallets(req: Request, res: Response) {
    Wallet.find({}, (err, wallet) => {
      if (err) {
        res.send(err);
      }
      res.json(wallet);
    });
  }

  public getWalletWithID(req: Request, res: Response) {
    Wallet.findById(req.params.walletId, (err, wallet) => {
      if (err) {
        res.send(err);
      }
      res.json(wallet);
    });
  }

  public updateWallet(req: Request, res: Response) {
    Wallet.findOneAndUpdate(
      { _id: req.params.walletId },
      req.body,
      { new: true },
      (err, wallet) => {
        if (err) {
          res.send(err);
        }
        res.json(wallet);
      }
    );
  }

  public deleteWallet(req: Request, res: Response) {
    Wallet.remove({ _id: req.params.walletId }, (err) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted wallet!" });
    });
  }
}
