import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import { validJWTNeeded, superAdminOnly } from "../validators/authValidation";

export class UserRoutes {
  public userController: UserController = new UserController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/users")
      .get([validJWTNeeded, superAdminOnly], this.userController.getUsers)

      // POST endpoint
      .post([validJWTNeeded, superAdminOnly], this.userController.addNewUser);

    app
      .route("/api/v1/users/:userAddress")
      .get([validJWTNeeded], this.userController.getUserByWalletAddress)

      // UPDATE endpoint
      .patch([validJWTNeeded, superAdminOnly], this.userController.updateUserDetails);
  }
}
