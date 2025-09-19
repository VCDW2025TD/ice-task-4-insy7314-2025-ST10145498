// backend/src/app.js
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

// Parse JSON and CSP reports sent by the browser (application/json and application/csp-report)
app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// CORS - allow your frontend dev origins (adjust ports if needed)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Baseline security headers (X-Content-Type-Options, Referrer-Policy, etc.)
app.use(helmet());

// Content Security Policy directives (report-only in dev)
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "https://apis.google.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:"],
  connectSrc: [
    "'self'",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://localhost:5000",
    "https://localhost:5000",
  ],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      ...cspDirectives,
      // Incoming reports (browser POSTs) will be sent to this endpoint
      "report-uri": ["/csp-report"],
    },
    // REPORT-ONLY in dev, ENFORCE in production
    reportOnly: process.env.NODE_ENV !== "production",
  })
);

// Endpoint to accept CSP violation reports from browsers
app.post("/csp-report", (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// Routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user?.id || "unknown"}!`,
    timestamp: new Date().toISOString(),
  });
});

// Optionally serve frontend build if SERVE_FRONTEND is "true"
if (process.env.SERVE_FRONTEND === "true") {
  const staticPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

module.exports = app;
