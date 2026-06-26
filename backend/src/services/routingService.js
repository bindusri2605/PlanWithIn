const axios = require("axios");
const ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

/**
 * Calculates travel time and cost using OpenRouteService
 */
async function getTravelTimeAndDistance({ from, to }) {
  if (!from?.lat || !to?.lat) {
    throw new Error("Invalid coordinate parameters for routing service");
  }

  try {
    const response = await axios.post(
      ORS_URL,
      {
        coordinates: [
          [parseFloat(from.lng), parseFloat(from.lat)],
          [parseFloat(to.lng), parseFloat(to.lat)]
        ],
        preference: "fastest"
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const summary = response.data.features[0].properties.summary;
    const distanceKm = summary.distance / 1000;

    return {
      // 2.3x multiplier for realistic urban traffic conditions
      travelTimeMinutes: Math.ceil((summary.duration / 60) * 2.3),
      distanceKm: +distanceKm.toFixed(2),
      travelCost: Math.ceil(distanceKm * 12) // Estimated ₹12/km
    };
  } catch (error) {
    console.error("Routing Error: Falling back to distance estimation.");
    const fallbackDist = 5; 
    return {
      travelTimeMinutes: Math.ceil(fallbackDist * 3), // Fallback: 3 mins per km
      distanceKm: fallbackDist,
      travelCost: fallbackDist * 12
    };
  }
}

module.exports = { getTravelTimeAndDistance };