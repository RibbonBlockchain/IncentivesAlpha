import { Request, Response, NextFunction } from "express";
import { PatientInteractionListController } from "../controllers/patientInteractionController";
import { validJWTNeeded, superAdminOnly } from "../validators/authValidation";

export class InteractionRoutes {
  public interactionController: PatientInteractionListController = new PatientInteractionListController();

  public routes(app): void {
    app
      .route("/api/v1/interactions")

      // GET all logs by address
      .get(
        [validJWTNeeded],
        this.interactionController.getAllPatientInteractions
      )

      .post([validJWTNeeded], this.interactionController.addPatientInteraction);

    app
      .route("/api/v1/interactions/:userAddress")
      .post(
        [validJWTNeeded],
        this.interactionController.getPatientInteractionByAddress
      );
  }
}
