import * as express from "express";
import * as fileUpload from "express-fileupload";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/walletRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { AuthRoutes } from "./routes/authRoute";
import { InteractionListRoutes } from "./routes/interactionListRoutes";
import * as mongoose from "mongoose";
import * as cors from "cors";
require("dotenv").config();

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
  public interactionRoutes: InteractionListRoutes = new InteractionListRoutes();
  // public mongoUrl: string = 'mongodb://localhost/Ribbon-Incentives-API-DB';
  // public mongoUrl: string = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
  public mongoUrl: string;

  constructor() {
    if (isDocker()) {
      this.mongoUrl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
      console.log("Running in docker mode");
    } else {
      this.mongoUrl = `mongodb://35.228.153.27:27017/Ribbon-Incentives-API-DB`;
      console.log("Running in development mode. Will connect to staging DB");
    }

    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
    this.userRoutes.routes(this.app);
    this.authRoutes.routes(this.app);
    this.interactionRoutes.routes(this.app);
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(fileUpload());
    this.app.use(cors());
    // serving static files
    this.app.use(express.static("public"));
  }

  private mongoSetup(): void {
    mongoose.Promise = global.Promise;
    let mongoUrl = this.mongoUrl;
    var connectWithRetry = function() {
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
            setTimeout(connectWithRetry, 1000);
          }
        }
      );
    };
    connectWithRetry();
  }
}

export default new App().app;
