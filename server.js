// Main server file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", authRoutes);

// connect to database and then start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server running on http://localhost:" + PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });
