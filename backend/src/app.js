const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/plans", planRoutes);

app.get("/", (req, res) => {
  res.send("PlanWithIn API running");
});

module.exports = app;