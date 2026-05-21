const express = require("express");

const cors = require("cors");

const path = require("path");

const noteRoutes = require("./routes/noteRoutes");

const authRoutes = require("./routes/authRoutes");

const adminRoutes = require("./routes/adminRoutes");

const uploadRoutes = require("./routes/uploadRoutes");

const {
  notFound,
  errorHandler
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Static Uploads Folder
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Notes API Running"
  });
});

// Routes
app.use("/api/notes", noteRoutes);

app.use("/api/users", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/upload", uploadRoutes);

// Error Middleware
app.use(notFound);

app.use(errorHandler);

module.exports = app;