import { Request, Response, NextFunction } from "express";
import { InteractionListController } from "../controllers/interactionController";
import { validJWTNeeded, superAdminOnly } from "../validators/authValidation";

export class InteractionListRoutes {
  public interactionListController: InteractionListController = new InteractionListController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/interactions")
      .get([validJWTNeeded, superAdminOnly], this.interactionListController.getAllInteractionLists)

      // POST endpoint
      .post([validJWTNeeded, superAdminOnly], this.interactionListController.addInteraction);

    app
      .route("/api/v1/interactions/:interactionId")

      // UPDATE endpoint
      .patch([validJWTNeeded, superAdminOnly], this.interactionListController.updateInteractionDetails);
  }
}
