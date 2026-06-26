const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  city: String,
  category: String,
  averageSpend: Number,
  averageTime: Number,
  travelTimeFromStart: Number,
  travelCost: Number
});

module.exports = mongoose.model("Place", placeSchema);
