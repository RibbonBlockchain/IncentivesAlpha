import { Request, Response, NextFunction } from "express";
import { SettingsController } from "../controllers/settingsController";
import { validJWTNeeded, superAdminOnly, superAdminAndCommunityHealthWorkerOnly } from "../validators/authValidation";

export class SettingsRoutes {
  public settingsController: SettingsController = new SettingsController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/healthcentres/settings")
      .get([validJWTNeeded, superAdminAndCommunityHealthWorkerOnly], this.settingsController.getSettings)

      // POST endpoint
      .post([validJWTNeeded, superAdminOnly], this.settingsController.addSettings);

  }
}