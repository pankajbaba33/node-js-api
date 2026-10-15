const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const personalDetailsRoutes = require("./routes/personalDetailsRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files statically (e.g. resumes)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MongoDB Connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/personal-details", personalDetailsRoutes);

// Health check root route
app.get("/", (req, res) => {
  res.json({
    message: "HireHub API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Server Listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});