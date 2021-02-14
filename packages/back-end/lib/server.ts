import app from "./app";
import * as https from "https";
import * as fs from "fs";
const PORT = 3000;
const isDocker = require("is-docker");

app.listen(PORT, () => {
  console.log("Express server running on port " + PORT);
});

