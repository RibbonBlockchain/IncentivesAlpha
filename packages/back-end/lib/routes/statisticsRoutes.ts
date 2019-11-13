import {StatisticsController} from "../controllers/statisticsController";
import {
    validJWTNeeded,
    superAdminOnly,
    superAdminAndCommunityHealthWorkerOnly
} from "../validators/authValidation";

export class StatisticsRoutes {
    public statisticsController: StatisticsController = new StatisticsController();

    public routes(app) : void {
        app
        .route("/api/v1/statistics/:userAddress")
        .post(
            [validJWTNeeded],
            this.statisticsController.getStatistics
      );
    }
}