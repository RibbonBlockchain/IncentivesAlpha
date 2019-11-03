import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import { validJWTNeeded, superAdminOnly, communityHealthWorkerOnly } from "../validators/authValidation";
import { check, validationResult } from "express-validator";

export class UserRoutes {
  public userController: UserController = new UserController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/users")
      .get([validJWTNeeded], this.userController.getUsers)

    app
      .route("/api/v1/users/admin")
      .post([validJWTNeeded, superAdminOnly], this.userController.addAdministrator)

    app
      .route("/api/v1/users/chw")
      // POST endpoint add community health worker
      .post([validJWTNeeded, superAdminOnly, check('phoneNumber').isLength({ max: 11, min: 11 })], this.userController.addNewCommunityHealthWorker);

    app
      .route("/api/v1/users/practitioners")
      // POST endpoint add community health worker
      .post([validJWTNeeded], this.userController.addNewPractitioner);

    app
      .route("/api/v1/users/patients")
      // POST endpoint add community health worker
      .post([validJWTNeeded], this.userController.addNewPatient);

    app
      .route("/api/v1/users/:userAddress")
      .get([validJWTNeeded], this.userController.getUserByWalletAddress)

      // UPDATE endpoint
      .patch([validJWTNeeded, superAdminOnly], this.userController.updateUserDetails);
  }
}
