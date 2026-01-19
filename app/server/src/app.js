const express = require("express");
const cors = require("cors");
const path = require("path");
const listingsRoute = require("./routes/listings");
const Listing = require("./models/Listing");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Initialize database
Listing.createTable();
Listing.seed();

// Routes
app.use("/", listingsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
