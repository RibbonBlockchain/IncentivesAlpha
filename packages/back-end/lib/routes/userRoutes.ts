import * as mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import {
  validJWTNeeded,
  superAdminOnly,
  communityHealthWorkerOnly
} from "../validators/authValidation";
import { UserSchema } from "../models/userModel";
import {MinorsSchema} from "../models/minorsModel";
import { check, validationResult } from "express-validator";
import {validateUserSchema} from "../validators/userValidation";

const User = mongoose.model("user", UserSchema)
const Minors = mongoose.model("Minors", MinorsSchema)

export class UserRoutes {
  public userController: UserController = new UserController(User, Minors);

  public routes(app): void {
    // Users
    app
      .route("/api/v1/users")
      .get([validJWTNeeded], this.userController.getUsers);

    app
      .route("/api/v1/users/admin")
      .post(
        [validJWTNeeded, superAdminOnly, validateUserSchema],
        this.userController.addAdministrator
      );

    app
      .route("/api/v1/users/chw")
      // POST endpoint add community health worker
      .post(
        [
          validJWTNeeded,
          superAdminOnly,
          check("phoneNumber").isLength({ max: 11, min: 11 }),
          validateUserSchema
        ],
        this.userController.addNewCommunityHealthWorker
      );

    app
      .route("/api/v1/users/practitioners")
      // POST endpoint add community health worker
      .post([validJWTNeeded], this.userController.addNewPractitioner);

    app
      .route("/api/v1/users/patients")
      // POST endpoint add community health worker
      .post([validJWTNeeded], this.userController.addNewPatient);

    app
      .route("/api/v1/users/minors")
      .post([validJWTNeeded], this.userController.addNewMinor)

    app
      .route("/api/v1/users/:userAddress")
      .get([validJWTNeeded], this.userController.getUserByWalletAddress)

      // UPDATE endpoint
      .patch(
        [validJWTNeeded, superAdminOnly],
        this.userController.updateUserDetails
      );
  }
}
