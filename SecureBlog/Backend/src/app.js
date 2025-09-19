// backend/src/app.js
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

// Parse JSON and CSP reports sent by the browser.
// Browsers POST CSP violation reports with content-type application/csp-report.
// We also accept application/json for convenience across browsers.
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

// Content Security Policy directives
// IMPORTANT: in dev we use reportOnly so the browser reports violations but does not block
const cspDirectives = {
  defaultSrc: ["'self'"],
  // allow same-origin scripts; include google API as your assignment shows
  scriptSrc: ["'self'", "https://apis.google.com"],
  // styles may need 'unsafe-inline' in development if you use inline styles; assignment requested it
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:"],
  // allow dev frontend + backend ports so browser can connect for dev requests
  connectSrc: [
    "'self'",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://localhost:5000",
    "http://localhost:4000",
  ],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      ...cspDirectives,
      // browsers send violation reports to this endpoint (we accept application/csp-report above)
      "report-uri": ["/csp-report"],
    },
    // REPORT-ONLY in dev, ENFORCE in production
    reportOnly: process.env.NODE_ENV !== "production",
  })
);

// Receive browser violation reports (browser will POST JSON to this endpoint)
app.post("/csp-report", (req, res) => {
  // The browser sends a JSON payload describing the blocked resource and directive
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// API routes
app.use("/api/auth", authRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user?.id || "unknown"}!`,
    timestamp: new Date().toISOString(),
  });
});

// (Optional) Serve frontend build when you want to test CSP with a static build
if (process.env.SERVE_FRONTEND === "true") {
  const staticPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

module.exports = app;
