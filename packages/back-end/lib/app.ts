require("dotenv").config();
import * as express from "express";
import * as fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/walletRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AuthRoutes } from "./routes/authRoute";
import { LogRoutes } from "./routes/logRoutes";
import { ActivityListRoutes } from "./routes/activityListRoutes";
import { InteractionRoutes } from "./routes/patientInteractionRoutes";
import { PrescriptionListRoutes } from "./routes/prescriptionRoutes";
import { SettingsRoutes } from "./routes/settingsRoutes";
import * as mongoose from "mongoose";
import * as cors from "cors";

const isDocker = require("is-docker");

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;

class App {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();
  public userRoutes: UserRoutes = new UserRoutes();
  public authRoutes: AuthRoutes = new AuthRoutes();
  public activityRoutes: ActivityListRoutes = new ActivityListRoutes();
  public logRoutes: LogRoutes = new LogRoutes();
  public interactionRoutes: InteractionRoutes = new InteractionRoutes();
  public prescriptionRoutes: PrescriptionListRoutes = new PrescriptionListRoutes();
  public settingsRoutes: SettingsRoutes = new SettingsRoutes();
  // public mongoUrl: string = 'mongodb://localhost/Ribbon-Incentives-API-DB';
  // public mongoUrl: string = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
  public mongoUrl: string;

  // options for cors middleware
  public corsOption: cors.CorsOptions = {
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "X-Access-Token",
      "Authorization"
    ],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
  };

  constructor() {
    if (isDocker()) {
      this.mongoUrl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
      console.log("Running in docker mode");
      console.log("Connecting to: ", this.mongoUrl);
    } else {
      this.mongoUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}
      `;
      console.log("Running in development mode. Will connect to staging DB");
      console.log("Connecting to: ", this.mongoUrl);
    }

    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
    this.userRoutes.routes(this.app);
    this.authRoutes.routes(this.app);
    this.activityRoutes.routes(this.app);
    this.logRoutes.routes(this.app);
    this.interactionRoutes.routes(this.app);
    this.prescriptionRoutes.routes(this.app);
    this.settingsRoutes.routes(this.app);
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use(cors(this.corsOption));
    // serving static files
    this.app.use(express.static("public"));

    // enable pre-flight
    this.app.options("*", cors(this.corsOption));
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    let mongoUrl = this.mongoUrl;
    const connectWithRetry = function() {
      mongoose.connect(
        mongoUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function(err) {
          if (err) {
            console.error(
              "Failed to connect to mongodb on startup - retrying in 1 sec",
              err
            );
            setTimeout(connectWithRetry, 5000);
          }
        }
      );
    };
    connectWithRetry();
  }
}

export default new App().app;
