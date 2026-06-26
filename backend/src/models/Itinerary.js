const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema({
  // This links the trip to your User model
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  totalTimeUsed: Number,
  totalCost: Number,
  address: String,
  steps: [
    {
      action: String,
      description: String,
      location: String,
      time: Number,
      cost: Number
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Itinerary", ItinerarySchema);