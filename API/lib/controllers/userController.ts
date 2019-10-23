import * as mongoose from "mongoose";
import { UserSchema } from "../models/userModel";
import { Request, Response } from "express";
import { body } from "express-validator";
import { mapUserDataToResponse } from "../serializers/userDataSerializer";


const User = mongoose.model("User", UserSchema);

export class UserController {
  public async addNewCommunityHealthWorker(req: Request, res: Response) {
    if(req.body.role!=2){
      res.status(400).send({status:400, error:"Please ensure role is 1 for community health worker"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      await newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public async addNewPractitioner(req: Request, res: Response) {
    if(req.body.role!=3){
      res.status(400).send({status:400, error:"Please ensure role is 2 for practitioner"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      await newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public async addNewPatient(req: Request, res: Response) {
    if(req.body.role!=4){
      res.status(400).send({status:400, error:"Please ensure role is 3 for patient"})
    }
    else{
      let form_data = req.body;
      //add required nonce field for login challenge
      let nonce = Math.floor(Math.random() * 1000000);
      form_data.nonce = nonce;
      let newUser = new User(form_data);

      await newUser.save((err, user) => {
        if (err) {
          res.send({ message: err });
        }
        res.json({ status: 200, data: user });
      });
    }
  }

  public async getUsers(req: Request, res: Response) {
    await User.find({}, (err, users) => {
      if (err) {
        res.send({ message: err });
      }
      res.json({ status: 200, data: users });
    });
  }

  public async getUserByWalletAddress(req: Request, res: Response) {
    try {
      await User.findOne(
        { 
          publicAddress: 
          req.params.userAddress 
        }).then(async user => {
          res.json({ status: 200, data: mapUserDataToResponse(user) });
        }).catch(error => {
          res.status(404).json({
            status:404,
            message: "User with wallet address doesnot exist"
          });
        })
    }catch(err){
      res.status(404).json({ message: err.toString() });
    }
  }

  public async updateUserDetails(req: Request, res: Response) {
    await User.updateOne(
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
