import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/walletRoutes";
import * as mongoose from "mongoose";

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
  // public mongoUrl: string = 'mongodb://localhost/Ribbon-Incentives-API-DB';
  // public mongoUrl: string = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
  public mongoUrl: string = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

  constructor() {
    this.config();
    this.mongoSetup();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
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
