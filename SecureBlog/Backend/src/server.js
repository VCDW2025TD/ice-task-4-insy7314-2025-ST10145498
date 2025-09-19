// backend/src/server.js
const fs = require("fs");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const DEFAULT_PORT = Number(process.env.PORT) || 5000;
const serveFrontend = process.env.SERVE_FRONTEND === "true";

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    } else {
      console.warn("MONGO_URI not set — skipping DB connect.");
    }

    const sslKeyExists = fs.existsSync("./ssl/privatekey.pem");
    const sslCertExists = fs.existsSync("./ssl/certificate.pem");

    if (sslKeyExists && sslCertExists) {
      const sslOptions = {
        key: fs.readFileSync("./ssl/privatekey.pem"),
        cert: fs.readFileSync("./ssl/certificate.pem"),
      };
      https.createServer(sslOptions, app).listen(DEFAULT_PORT, () => {
        console.log(`Secure server running at https://localhost:${DEFAULT_PORT}`);
        console.log(
          `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
        );
      });
    } else {
      // fallback to plain HTTP (easier for testing if you don't have cert files)
      http.createServer(app).listen(DEFAULT_PORT, () => {
        console.log(`Server running at http://localhost:${DEFAULT_PORT}`);
        console.log(
          `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
        );
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
