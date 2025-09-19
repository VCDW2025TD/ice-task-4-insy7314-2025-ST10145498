// backend/src/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Parse JSON and CSP reports sent by the browser
app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// CORS – allow frontend
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

// 1) Baseline security headers
app.use(helmet());

// 2) Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      "report-uri": ["/csp-report"], // CSP violation reporting
    },
    reportOnly: process.env.NODE_ENV !== "production", // Report-only in dev
  })
);

// 3) Receive browser violation reports
app.post("/csp-report", (req, res) => {
  console.log("CSP Violation Report:", JSON.stringify(req.body, null, 2));
  res.sendStatus(204);
});

// MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/secureblog")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Health route
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Protected route example
const { protect } = require("./middleware/authMiddleware");
app.get("/api/protected", protect, (req, res) => {
  res.json({ 
    message: `Hello user ${req.user.id}! This is a protected route.`,
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SecureBlog API running at http://localhost:${PORT}`);
  console.log(
    `CSP mode: ${process.env.NODE_ENV !== "production" ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`
  );
});

module.exports = app;
