import app from "./app";
require("dotenv");
const { SSL_KEY, SSL_CERT } = process.env;
import * as https from "https";
import * as fs from "fs";
const PORT = 2053;

const httpsOptions = {
  key: String(SSL_KEY),
  cert: String(SSL_CERT)
};
console.log(SSL_KEY);
console.log(SSL_CERT);

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log("Express server listening on port " + PORT);
});

// app.listen(PORT, () => {
//   console.log("Express server running on port " + PORT);
// });
