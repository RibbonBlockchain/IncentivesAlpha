import { AuthController } from "../controllers/authController";

/** POST /api/auth */
export class AuthRoutes {
  public authController: AuthController = new AuthController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/auth")

      // POST endpoint
      .post(this.authController.authenticateUser);
  }
}
