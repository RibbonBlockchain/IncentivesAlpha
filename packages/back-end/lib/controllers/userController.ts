import { Request, Response } from "express";
import { body } from "express-validator";
import { mapUserDataToResponse } from "../serializers/userDataSerializer";
import { getCurrentUserAddress } from "../validators/authValidation";

// const User = mongoose.model("User", UserSchema);

export class UserController {
  public usermodel: any;
  public minormodel: any;

  constructor(User: any, Minors: any){
    this.usermodel = User
    this.minormodel = Minors
  }

  public addAdministrator = async (req: Request, res: Response) => {
    try{
      if (req.body.role != 1) {
        res
          .status(400)
          .send({
            status: 400,
            error: "Please ensure role is 1 for administrator"
          });
      } else {
        let form_data = req.body;
        //check for the user who is adding the community health worker

        let loggedInUserId = getCurrentUserAddress(req, res);

        //add required nonce field for login challenge
        let nonce = Math.floor(Math.random() * 1000000);
        form_data.nonce = nonce;
        form_data.onBoardedBy = loggedInUserId;
        let newUser = new this.usermodel(form_data);

        await newUser
          .save()
          .then(async user => {
            res.status(201).json({ status: 201, data: user });
          })
          .catch(error => {
            res
              .status(400)
              .json({
                status: 400,
                message: "Duplicate address or Phone Number"
              });
          });
      }
    }catch{
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public addNewCommunityHealthWorker = async (req: Request, res: Response) => {
    try {
      if (req.body.role != 2) {
        res
          .status(400)
          .send({
            status: 400,
            error: "Please ensure role is 2 for community health worker"
          });
      } else {
        let form_data = req.body;
        //check for the user who is adding the community health worker

        let loggedInUserId = getCurrentUserAddress(req, res);

        //add required nonce field for login challenge
        let nonce = Math.floor(Math.random() * 1000000);
        form_data.nonce = nonce;
        form_data.onBoardedBy = loggedInUserId;
        let newUser = new this.usermodel(form_data);

        await newUser
          .save()
          .then(async user => {
            res.status(201).json({ status: 201, data: user });
          })
          .catch(error => {
            res
              .status(400)
              .json({
                status: 400,
                message: "Duplicate address or Phone Number"
              });
          });
      }
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public addNewPractitioner = async (req: Request, res: Response) => {
    try {
      if (req.body.role != 4) {
        res
          .status(400)
          .send({
            status: 400,
            error: "Please ensure role is 4 for Practitioner"
          });
      } else {
        let form_data = req.body;
        //add required nonce field for login challenge

        let loggedInUserId = getCurrentUserAddress(req, res);

        let nonce = Math.floor(Math.random() * 1000000);
        form_data.nonce = nonce;
        form_data.onBoardedBy = loggedInUserId;
        let newUser = new this.usermodel(form_data);

        await newUser
          .save()
          .then(async user => {
            res.status(201).json({ status: 201, data: user });
          })
          .catch(error => {
            res
              .status(400)
              .json({
                status: 400,
                message: "Duplicate address or Phone Number"
              });
          });
      }
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public addNewPatient = async (req: Request, res: Response) => {
    try {
      if (req.body.role != 3) {
        res
          .status(400)
          .send({ status: 400, error: "Please ensure role is 3 for patient" });
      } else {
        let form_data = req.body;

        let loggedInUserId = getCurrentUserAddress(req, res);

        //add required nonce field for login challenge
        let nonce = Math.floor(Math.random() * 1000000);
        form_data.nonce = nonce;
        form_data.onBoardedBy = loggedInUserId;
        let newUser = new this.usermodel(form_data);

        await newUser
          .save()
          .then(async user => {
            res.status(201).json({ status: 201, data: user });
          })
          .catch(error => {
            res
              .status(400)
              .json({
                status: 400,
                message: "Duplicate address or Phone Number"
              });
          });
      }
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public addNewMinor = async (req: Request, res: Response) => {
    let minorData = {
      relatedTo: req.body.parent_id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      idNumber: req.body.idNumber,
      role: req.body.role
    }
    let newMinor = new this.minormodel(minorData)
    try {
      await newMinor
          .save()
          .then(async minor => {
            await this.usermodel.updateOne(
              { _id: req.body.parent_id },
              {
                $set: {
                  minors: minor._id
                }
              })
              .catch(error => {
                res.status(400).json({error: error})
              })
            res.status(201).json({ status: 201, data: minor });
          })
        .catch(error => {
          res
            .status(400)
            .json({
              status: 400,
              message: "Invalid patient ID"
            });
        });
    } catch {
      res.status(500).json({ status: 500, message: "Server Error" });
    }
  }

  public getUsers = async (req: Request, res: Response) => {
    await this.usermodel.find({})
    .populate("minors", ["firstName", "lastName", "idNumber", "role", "createdDate"])
    .populate("onBoardedBy", ["firstName", "lastName", "publicAddress"])
    .then(async users => {
      res.json({ status: 200, data: users });
    })
    .catch(error => {
      res.status(404).json({
        status: 404,
      });
    })
  }

  public getMinors = async (req: Request, res: Response) => {
    await this.minormodel.find({})
    .then(async minors => {
      res.json({ status: 200, data: minors });
    })
    .catch(error => {
      res.status(404).json({
        status: 404,
      });
    })
  }

  public getUserByWalletAddress = async (req: Request, res: Response) => {
    try {
      await this.usermodel.findOne({
        publicAddress: req.params.userAddress
      })
        .then(async user => {
          res.json({ status: 200, data: mapUserDataToResponse(user) });
        })
        .catch(error => {
          res.status(404).json({
            status: 404,
            message: "User with wallet address doesnot exist"
          });
        });
    } catch (err) {
      res.status(404).json({ message: err.toString() });
    }
  }

  public updateUserDetails = async (req: Request, res: Response) => {
    await this.usermodel.updateOne(
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
