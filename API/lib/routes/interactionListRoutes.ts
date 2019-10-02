import { Request, Response, NextFunction } from "express";
import { InteractionListController } from "../controllers/interactionController";

export class InteractionListRoutes {
  public interactionListController: InteractionListController = new InteractionListController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/interactions")
      .get(this.interactionListController.getAllInteractionLists)

      // POST endpoint
      .post(this.interactionListController.addInteraction);

    app
      .route("/api/v1/interactions/:interactionId")

      // UPDATE endpoint
      .patch(this.interactionListController.updateInteractionDetails);
  }
}
