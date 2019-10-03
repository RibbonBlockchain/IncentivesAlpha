import * as jwt from 'jsonwebtoken';
import { config } from "../../config";
import * as mongoose from "mongoose";

import { UserSchema } from "../models/userModel";

const User = mongoose.model("User", UserSchema);

export const validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send({status:401, error:"unathorized, Invalid Token"});
            } else {
                req.jwt = jwt.verify(authorization[1], config.secret);
                return next();
            }

        } catch (err) {
            return res.status(403).send({status:403, error:"Invalid token signature"});
        }
    } else {
        return res.status(401).send({status:401, error:"unathorized"});
    }
};

export const superAdminOnly = (req, res, next) => {
    try {
        let publicAddress = req.jwt.payload.publicAddress;
        User.findOne({ publicAddress }).then(user => {
            if(user.role!=0){
                return res.status(401).send({status:401, error:"You are not authorized to view this content"})
            } else {
                return next()
            }
        })
    }catch (err){
        return res.status(403).send({status:403, error:"Invalid token signature"});
    }
}

export const communityHealthWorkerOnly = (req, res, next) => {
    try {
        let publicAddress = req.jwt.payload.publicAddress;
        User.findOne({ publicAddress }).then(user => {
            if(user.role!=1){
                return res.status(401).send({status:401, error:"You are not authorized to view this content"})
            } else {
                return next()
            }
        })
    }catch (err){
        return res.status(403).send({status:403, error:"Invalid token signature"});
    }
}

// export const addressOwnerOnly = (req, res, next) => {
//     try {
//         let publicAddress = req.jwt.payload.publicAddress;
//         User.findOne({ publicAddress }).then(user => {
//             if(user.role!=1){
//                 return res.status(401).send({status:401, error:"You are not authorized to view this content"})
//             } else {
//                 return next()
//             }
//         })
//     }catch (err){
//         return res.status(403).send({status:403, error:"Invalid token signature"});
//     }
// }