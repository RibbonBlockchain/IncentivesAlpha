import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import { validJWTNeeded } from "../validators/authValidation";

export class UserRoutes {
  public userController: UserController = new UserController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/users")
      .get([validJWTNeeded], this.userController.getUsers)

      // POST endpoint
      .post(this.userController.addNewUser);

    app
      .route("/api/v1/users/:userAddress")
      .get(this.userController.getUserByWalletAddress)

      // UPDATE endpoint
      .patch(this.userController.updateUserDetails);
  }
}
