const { getNearbyPlaces } = require("./mapsService");
const { normalizePlace } = require("../utils/placeNormalizer");

/**
 * Coordinates the discovery and normalization of points of interest
 * @param {Object} params - userLocation (lat/lng) and user preference
 * @returns {Promise<Array>} Normalized places
 */
async function discoverPlaces({ userLocation, preference }) {
  console.log(`🔍 Starting discovery for category: ${preference}`);

  try {
    // 1. Fetch raw data from OpenStreetMap via mapsService
    const osmPlaces = await getNearbyPlaces({
      lat: userLocation.lat,
      lng: userLocation.lng,
      preference
    });

    if (!osmPlaces || osmPlaces.length === 0) {
      console.warn(`⚠️ No results found for ${preference} in this area.`);
      return [];
    }

    // 2. Transform raw data into the app's standard Place format
    // Travel information is excluded here to optimize performance; 
    // it will be handled by the generator logic.
    const results = osmPlaces.map(osmPlace => {
      return normalizePlace(
        osmPlace, 
        null, // Travel info handled during plan sequencing
        preference
      );
    });

    console.log(`✅ Successfully normalized ${results.length} places for ${preference}.`);
    return results;

  } catch (error) {
    console.error("Place Discovery Service Error:", error.message);
    return [];
  }
}

module.exports = { discoverPlaces };