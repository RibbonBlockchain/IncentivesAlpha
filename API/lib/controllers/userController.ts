import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { Request, Response } from "express";

const User = mongoose.model("User", UserSchema);

export class UserController {
  public addNewCommunityHealthWorker(req: Request, res: Response) {
    if(req.body.role!=1){
      res.status(400).send({status:400, error:"Please ensure role is 1 for community health worker"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public addNewPractitioner(req: Request, res: Response) {
    if(req.body.role!=2){
      res.status(400).send({status:400, error:"Please ensure role is 2 for practitioner"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public addNewPatient(req: Request, res: Response) {
    if(req.body.role!=3){
      res.status(400).send({status:400, error:"Please ensure role is 3 for patient"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public getUsers(req: Request, res: Response) {
    User.find({}, (err, users) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: users });
    });
  }

  public getUserByWalletAddress(req: Request, res: Response) {
    User.find({ publicAddress: req.params.userAddress }, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json({ status: 200, data: user });
    });
  }

  public updateUserDetails(req: Request, res: Response) {
    User.updateOne(
      { publicAddress: req.params.userAddress },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName
        }
      },
      (err, user) => {
        if (err) {
          res.send(err);
        }
        res.json({ status: 200, data: user });
      }
    );
  }
}
