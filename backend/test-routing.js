require('dotenv').config();
const { getTravelTimeAndDistance } = require('./src/services/routingService');

async function runTest() {
    console.log("🚀 Testing Real-World Routing Accuracy...");
    
    // Example: From a specific coordinate in Amaravati to Mangalagiri Library
    const testCoords = {
        from: { lat: 16.5062, lng: 80.6480 }, // Example Start (Vijayawada/Amaravati area)
        to: { lat: 16.4334, lng: 80.5604 }    // Mangalagiri Public Library
    };

    const result = await getTravelTimeAndDistance(testCoords);

    if (result) {
        console.log("✅ Success!");
        console.log(`⏱️ Travel Time: ${result.travelTimeMinutes} mins`);
        console.log(`📏 Distance: ${result.distanceKm} km`);
        console.log(`💰 Estimated Cost: ₹${result.travelCost}`);
        
        if (result.travelTimeMinutes > 30) {
            console.log("\n💡 Observation: The time is high (30+ mins). This confirms it is using road traffic logic, not a straight line!");
        }
    } else {
        console.error("❌ Test Failed. Check your ORS_API_KEY in .env");
    }
}

runTest();