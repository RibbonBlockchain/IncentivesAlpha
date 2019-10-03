import * as mongoose from "mongoose";
import * as ethUtil from "ethereumjs-util";
import * as sigUtil from "eth-sig-util";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { ethers } from "ethers";

import { config } from "../../config";
import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

export class AuthController {
  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { signature, publicAddress } = req.body;
    if (!signature || !publicAddress)
      return res
        .status(400)
        .send({ error: "Request should have signature and publicAddress" });

    return (
      User.find({ publicAddress: publicAddress })
        ////////////////////////////////////////////////////
        // Step 1: Get the user with the given publicAddress
        ////////////////////////////////////////////////////
        .then(user => {
          if (!user)
            return res.status(401).send({
              error: `User with publicAddress ${publicAddress} is not found in database`
            });
          console.log(user)
          return user;
        })
        ////////////////////////////////////////////////////
        // Step 2: Verify digital signature
        ////////////////////////////////////////////////////
        .then(user => {
          //   if (!(user instanceof User)) {
          //     // Should not happen, we should have already sent the response
          //     throw new Error('User is not defined in "Verify digital signature".');
          //   }
          console.log(user[0].nonce);
          const msg = `I am signing my one-time nonce: ${user[0].nonce}`;

          // We now are in possession of msg, publicAddress and signature. We
          // will use a helper from eth-sig-util to extract the address from the signature
          // const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
          // const address = sigUtil.recoverPersonalSignature({
          //   data: msgBufferHex,
          //   sig: signature
          // });
          let address = ethers.utils.verifyMessage(msg, signature);
          console.log(address);

          // The signature verification is successful if the address found with
          // sigUtil.recoverPersonalSignature matches the initial publicAddress
          if (address.toLowerCase() === publicAddress.toLowerCase()) {
            console.log(address);
            return user;
          } else {
            return res
              .status(401)
              .send({ error: "Signature verification failed" });
          }
        })
        ////////////////////////////////////////////////////
        // Step 3: Generate a new nonce for the user
        ////////////////////////////////////////////////////
        .then(user => {
          if (!(user[0] instanceof User)) {
            // Should not happen, we should have already sent the response

            throw new Error(
              'User is not defined in "Generate a new nonce for the user".'
            );
          }

          user[0].nonce = Math.floor(Math.random() * 10000);
          return user[0].save();
        })
        ////////////////////////////////////////////////////
        // Step 4: Create JWT
        ////////////////////////////////////////////////////
        .then(user => {
          return new Promise<string>((resolve, reject) =>
            // https://github.com/auth0/node-jsonwebtoken
            jwt.sign(
              {
                payload: {
                  publicAddress
                }
              },
              config.secret,
              {},
              (err, token) => {
                if (err) {
                  return reject(err);
                }
                return resolve(token);
              }
            )
          );
        })
        .then(accessToken => res.json({ accessToken }))
        .catch(next)
    );
  }
}
