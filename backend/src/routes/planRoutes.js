const express = require("express");
const router = express.Router();

// Models
const Itinerary = require("../models/Itinerary");

// Core Services
const generatePlan = require("../services/planGeneratorService");
const { getNearbyPlaces } = require("../services/mapsService");
const { getTravelTimeAndDistance } = require("../services/routingService");
const { getNearbyTransportHubs } = require("../services/transportHubService");

/**
 * @route   POST /api/plans/save
 * @desc    Persists a generated itinerary to the database for a specific user
 * @access  Private (Requires userId)
 */
router.post("/save", async (req, res) => {
  try {
    const { userId, totalTimeUsed, totalCost, steps, address } = req.body;

    // Validation: Ensure the plan is associated with a user
    if (!userId) {
      return res.status(400).json({ error: "User identity is required to save an itinerary" });
    }

    const newItinerary = new Itinerary({
      userId,
      totalTimeUsed,
      totalCost,
      steps,
      address
    });

    const savedPlan = await newItinerary.save();
    
    res.status(201).json({ 
      status: "SUCCESS", 
      message: "Itinerary securely saved to history",
      planId: savedPlan._id 
    });
  } catch (error) {
    console.error("Critical: Save Itinerary Failure ->", error);
    res.status(500).json({ error: "System failed to save your plan. Please try again." });
  }
});

/**
 * @route   GET /api/plans/history/:userId
 * @desc    Retrieves all saved plans for a specific authenticated user
 * @access  Private
 */
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Optimized query: Find by user and sort by most recent creation date
    const plans = await Itinerary.find({ userId }).sort({ createdAt: -1 });
    
    // Returning direct array for seamless frontend mapping
    res.json(plans); 
  } catch (error) {
    console.error(`Error fetching history for user ${userId}:`, error);
    res.status(500).json({ error: "Could not retrieve your travel history." });
  }
});

/**
 * @route   POST /api/plans/generate
 * @desc    Core Logic: Fetches nearby points of interest and generates an optimized trip
 * @access  Public
 */
router.post("/generate", async (req, res) => {
  try {
    const userInput = req.body;

    // Location validation
    if (!userInput.lat || !userInput.lng) {
      return res.status(400).json({ error: "Current location is required to generate a plan." });
    }

    // Standardize preferences into an array
    const preferences = Array.isArray(userInput.preferences)
      ? userInput.preferences
      : [userInput.preference || "peace"];

    // 1. Fetch Transport Hubs (Anchor points for the trip)
    const hubs = await getNearbyTransportHubs({
      lat: userInput.lat,
      lng: userInput.lng
    });
    const anchorHub = userInput.returnToHub && hubs.length > 0 ? hubs[0] : null;

    // 2. Multi-threaded fetching of places based on user preferences
    const placesByPreference = {};
    await Promise.all(preferences.map(async (pref) => {
      const places = await getNearbyPlaces({
        lat: userInput.lat,
        lng: userInput.lng,
        preference: pref
      });
      placesByPreference[pref] = places;
    }));

    // 3. Algorithm: Sequence and optimize the trip
    const result = await generatePlan(
      { ...userInput, preferences, anchorHub },
      placesByPreference,
      getTravelTimeAndDistance
    );

    // 4. Return enriched response with metadata
    res.json({
      ...result,
      anchorHub,
      metadata: {
        generatedAt: new Date().toISOString(),
        locationUsed: `${userInput.lat}, ${userInput.lng}`,
        provider: "OpenStreetMap + ORS"
      }
    });

  } catch (error) {
    console.error("Critical: Plan Generation Failure ->", error);
    res.status(500).json({ error: "The AI failed to generate your plan. Please adjust your criteria." });
  }
});

/**
 * @route   POST /api/plans/travel-test
 * @desc    Debug utility for testing routing distance/time between two points
 * @access  Developer Only
 */
router.post("/travel-test", async (req, res) => {
  try {
    const { from, to } = req.body;
    const result = await getTravelTimeAndDistance({ from, to });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Travel test service unavailable." });
  }
});

module.exports = router;