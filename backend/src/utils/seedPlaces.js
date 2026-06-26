require("dotenv").config();
const mongoose = require("mongoose");
const Place = require("../models/Place");

mongoose.connect(process.env.MONGO_URI);

const places = [
  {
    name: "Forum Mall",
    city: "Hyderabad",
    category: "SHOPPING",
    averageSpend: 400,
    averageTime: 90,
    travelTimeFromStart: 20,
    travelCost: 50
  },
  {
    name: "City Park",
    city: "Hyderabad",
    category: "PEACE",
    averageSpend: 100,
    averageTime: 60,
    travelTimeFromStart: 15,
    travelCost: 20
  }
];

Place.insertMany(places)
  .then(() => {
    console.log("✅ Places seeded");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
