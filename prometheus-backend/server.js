const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const mongoose = require("mongoose");

// ===============================
// MIDDLEWARE
// ===============================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()) : [])
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection is established for serverless invocations
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
    try {
      await connectDB();
    } catch (err) {
      console.warn("DB connection check warning:", err.message);
    }
  }
  next();
});

// ===============================
// ROUTES
// ===============================
const voterRoutes = require("./routes/voterRoutes");
const rtoRoutes = require("./routes/rtoRoutes");
const welfareRoutes = require("./routes/welfareRoutes");
const translationRoutes = require("./routes/translationRoutes");
const consentRoutes = require("./routes/consentRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const requestRoutes = require("./routes/requestRoutes");
const officerRoutes = require("./routes/officerRoutes");
const { router: auditRoutes } = require("./routes/auditRoutes");
const gatewayRoutes = require("./routes/gatewayRoutes");

app.use("/api/profile", profileRoutes);
app.use("/api/voter", voterRoutes);
app.use("/api/rto", rtoRoutes);
app.use("/api/welfare", welfareRoutes);
app.use("/api/translate", translationRoutes);
app.use("/api/translation", translationRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/integrate", integrationRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/gateway", gatewayRoutes);
// ===============================
// TEST ROUTES
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Prometheus Integration Backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "Prometheus",
    status: "Operational"
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  if (require.main === module) {
    app.listen(PORT, () => {
      console.log(`Prometheus Backend running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;
