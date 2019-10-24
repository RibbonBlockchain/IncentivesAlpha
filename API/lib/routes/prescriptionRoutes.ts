import { Request, Response, NextFunction } from "express";
import { PrescriptionListController } from "../controllers/prescriptionController";
import { validJWTNeeded, superAdminOnly, superAdminAndCommunityHealthWorkerOnly } from "../validators/authValidation";

export class PrescriptionListRoutes {
  public prescriptionListController: PrescriptionListController = new PrescriptionListController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/prescriptions")
      .get([validJWTNeeded, superAdminAndCommunityHealthWorkerOnly], this.prescriptionListController.getAllPrescriptions)

      // POST endpoint
      .post([validJWTNeeded, superAdminOnly], this.prescriptionListController.addPrescription);

    // app
    //   .route("/api/v1/interactions/:interactionId")

    //   // UPDATE endpoint
    //   .patch([validJWTNeeded, superAdminOnly], this.interactionListController.updateInteractionDetails);
  }
}