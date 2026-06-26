/**
 * Identifies major transport hubs (Airports/Railways) near the user
 */
async function getNearbyTransportHubs({ lat, lng }) {
  const queries = [
    `railway=station`,
    `aeroway=aerodrome`
  ];

  const results = [];

  for (const query of queries) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&lat=${lat}&lon=${lng}&radius=8000&q=${query}`;
      
      const res = await fetch(url, {
        headers: { "User-Agent": "PlanWithIn/1.0 (Academic Project)" }
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        results.push(...data);
      }
    } catch (err) {
      console.error(`Transport Hub Fetch Failed (${query}):`, err.message);
    }
  }

  // Normalize data for consistency in the frontend
  return results.map(hub => ({
    name: hub.display_name?.split(",")[0] || "Transport Hub",
    type: hub.address?.aeroway ? "AIRPORT" : "RAILWAY",
    lat: Number(hub.lat),
    lng: Number(hub.lon)
  }));
}

module.exports = { getNearbyTransportHubs };