// backend/src/server.js
const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
require("dotenv").config();

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const start = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI not set. Skipping DB connect (useful for quick testing).");
    } else {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    }

    // create server using app (Express)
    const server = http.createServer(app);

    server.on("error", (err) => {
      // handle common listen errors
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${DEFAULT_PORT} is already in use. Either stop the process using that port or set PORT in your .env to a free port.`
        );
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });

    server.listen(DEFAULT_PORT, () => {
      console.log(`SecureBlog API running at http://localhost:${DEFAULT_PORT}`);
      console.log(
        `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
      );
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
