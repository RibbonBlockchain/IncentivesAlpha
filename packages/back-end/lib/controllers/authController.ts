import * as mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ethers } from "ethers";

import { config } from "../../config";
import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

export class AuthController {
  public async authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress)
      return res
        .status(400)
        .send({ error: "Request should have signature and publicAddress" });

    try {
      await User.findOne({ publicAddress })
        .then(async user => {
          if (typeof user === "undefined" || user === null) {
            res.status(404).send({ error: "USER_NOT_FOUND_ERR" });
          } else {
            if (!(user instanceof User)) {
              res.status(404).send("USER_INSTANCE_ERR");
            }
            const message = `Signing into RibbonBlockchain Dapp`;
            let address = ethers.utils.verifyMessage(message, signature);
            if (address.toLowerCase() !== publicAddress.toLowerCase()) {
              return res.status(401).send({ error: "SIG_FAIL_ERR" });
            } else {
              await jwt.sign(
                {
                  payload: {
                    id: user.id,
                    publicAddress
                  }
                },
                config.secret,
                {},
                (error, token) => {
                  if (error) {
                    res.status(401).send({ error });
                  } else {
                    res.status(200).send({ token });
                  }
                }
              );
            }
          }
        })
        .catch(error => {
          res.status(500).send({ error });
        });
    } catch (error) {
      res.status(500).send({ error });
    }
  }
}
