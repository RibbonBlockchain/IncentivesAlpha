import { Request, Response, NextFunction } from "express";
import { ActivityListController } from "../controllers/activityController";
import {
  validJWTNeeded,
  superAdminOnly,
  superAdminAndCommunityHealthWorkerOnly
} from "../validators/authValidation";

export class ActivityListRoutes {
  public activityListController: ActivityListController = new ActivityListController();

  public routes(app): void {
    // Users
    app
      .route("/api/v1/activities")
      .get(
        [validJWTNeeded, superAdminAndCommunityHealthWorkerOnly],
        this.activityListController.getAllActivities
      )

      // POST endpoint
      .post(
        [validJWTNeeded, superAdminOnly],
        this.activityListController.addActivity
      );

    // app
    //   .route("/api/v1/interactions/:interactionId")

    //   // UPDATE endpoint
    //   .patch([validJWTNeeded, superAdminOnly], this.interactionListController.updateInteractionDetails);
  }
}
