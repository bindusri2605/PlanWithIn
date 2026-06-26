const axios = require("axios");

/**
 * Maps frontend user preferences to OpenStreetMap (OSM) search queries
 * @param {string} preference 
 * @returns {string} OSM keyword
 */
function mapPreferenceToOSM(preference) {
  const mapping = {
    shopping: "mall",
    eating: "restaurant",
    peace: "park",
    reading: "library",
    games: "cinema",
    sightseeing: "tourism"
  };

  return mapping[preference?.toLowerCase()] || "park";
}

/**
 * Fetches points of interest (POI) from OpenStreetMap (Nominatim API)
 * @param {Object} coords - lat, lng, and preference
 */
async function getNearbyPlaces({ lat, lng, preference }) {
  if (!lat || !lng) {
    throw new Error("Geographic coordinates are required for place discovery");
  }

  try {
    const osmTag = mapPreferenceToOSM(preference);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: osmTag,
          format: "json",
          limit: 10, // Fetch top 10 results for better selection variety
          addressdetails: 1,
          // Defines a ~15-20km bounding box around user location
          viewbox: `${lng - 0.15},${lat + 0.15},${lng + 0.15},${lat - 0.15}`,
          bounded: 1
        },
        headers: {
          // Custom User-Agent as required by Nominatim Usage Policy
          "User-Agent": "PlanWithIn/1.0 (academic-project)"
        }
      }
    );

    // Standardize result objects for the Plan Generator
    return response.data.map(p => ({
      name: p.display_name.split(",")[0],
      lat: Number(p.lat),
      lng: Number(p.lon),
      fullAddress: p.display_name, 
      address: p.display_name,
      averageTime: 60, // Default duration in minutes
      averageSpend: 200 // Default estimated spend
    }));
  } catch (error) {
    console.error("OSM API Discovery Failure:", error.message);
    return []; // Return empty array to prevent generator crashes
  }
}

module.exports = { getNearbyPlaces };