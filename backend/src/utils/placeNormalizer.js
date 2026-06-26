/**
 * Transforms raw OpenStreetMap data into a standard format for the Plan Generator.
 * @param {Object} osmPlace - Raw data from OpenStreetMap/Overpass.
 * @param {Object} travelInfo - (Optional) Pre-calculated travel time/cost.
 * @param {string} preference - The category (peace, shopping, etc).
 */
function normalizePlace(osmPlace, travelInfo = null, preference = "") {
  // Extract clean name, fallback to category name if missing
  const name = osmPlace.tags?.name || osmPlace.name || `${preference.toUpperCase()} Spot`;

  // Extract address details or use a generic fallback
  const address = 
    osmPlace.tags?.["addr:full"] || 
    osmPlace.tags?.["addr:street"] || 
    osmPlace.fullAddress || 
    "Address not available";

  return {
    place_id: osmPlace.id || osmPlace.place_id,
    name: name,
    lat: parseFloat(osmPlace.lat || osmPlace.center?.lat),
    lng: parseFloat(osmPlace.lon || osmPlace.center?.lon || osmPlace.lng),
    fullAddress: address,
    category: preference,
    
    // Default values to help fill that 8-hour window
    // 60-90 mins is usually a good "block" for an activity
    averageTime: preference === "eating" ? 45 : 90, 
    
    // Default spending estimates in Rupees
    averageSpend: preference === "eating" ? 300 : (preference === "shopping" ? 1000 : 0),
    
    // Attach travel info if it was provided, otherwise set defaults
    travelTime: travelInfo?.travelTimeMinutes || 0,
    travelCost: travelInfo?.travelCost || 0
  };
}

module.exports = { normalizePlace };