import app from "./app";
import * as https from "https";
import * as fs from "fs";
const PORT = 2053;
const isDocker = require("is-docker");

if (isDocker()) {
  const httpsOptions = {
    key: fs.readFileSync("./config/key.pem"),
    cert: fs.readFileSync("./config/cert.pem")
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log("Express server listening on port " + PORT);
  });
} else {
  app.listen(PORT, () => {
    console.log("Express server running on port " + PORT);
  });
}
