const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

// Force Node.js to use Google DNS to bypass hotspot/router DNS that blocks Atlas SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "MongoDB Node.js Backend Server is Running" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cancer_detection";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
