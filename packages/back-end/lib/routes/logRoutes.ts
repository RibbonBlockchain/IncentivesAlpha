import { Request, Response, NextFunction } from "express";
import { LogController } from "../controllers/logController";
import { validJWTNeeded, superAdminOnly } from "../validators/authValidation";

export class LogRoutes {
  public logController: LogController = new LogController();

  public routes(app): void {
    // Logs
    app
      .route("/api/v1/transactions/logs")

      // POST endpoint
      .post([validJWTNeeded], this.logController.addNewLog);

    app
      .route("/api/v1/transactions/logs/:txn_address")

      // GET all logs by address
      .get([validJWTNeeded], this.logController.getAllLogs);
  }
}
