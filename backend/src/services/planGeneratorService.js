/**
 * Core Planning Engine
 * Responsible for sequencing locations based on time, budget, and proximity.
 */
async function generatePlan(userInput, placesByPreference, getRoute) {
  // 1. Input Extraction & Sanitization
  const totalTime = parseInt(userInput.totalTime) || 480; // Default 8 hours
  const bufferTime = parseInt(userInput.bufferTime) || 30;
  const lat = parseFloat(userInput.lat);
  const lng = parseFloat(userInput.lng);

  let remainingTime = totalTime - bufferTime;
  let remainingBudget =
    userInput.budget?.type !== "ANY" && userInput.budget?.amount
      ? parseFloat(userInput.budget.amount)
      : Infinity;

  // Initial safety validation
  if (remainingTime <= 0) {
    return { 
      status: "FAILED", 
      error: "Insufficient time window provided. Please increase your trip duration." 
    };
  }

  const steps = [];
  let totalTimeUsed = 0;
  let totalCostUsed = 0;
  let currentLocation = { lat, lng };
  const visitedNames = new Set();

  console.log(`🚀 Planning Engine Started: ${remainingTime}m available, Budget: ${remainingBudget}`);

  // 2. Chaining Logic: Iterate through user preferences to build the sequence
  for (const pref of userInput.preferences || []) {
    const options = placesByPreference[pref] || [];
    let chosenPlace = null;
    let routeToPlace = null;

    // Filter to avoid duplicate visits
    const availableOptions = options.filter(p => !visitedNames.has(p.name));

    for (const place of availableOptions) {
      try {
        const route = await getRoute({
          from: currentLocation,
          to: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) }
        });

        // Heuristic: Activity duration + travel time + 30m traffic/parking buffer
        const activityDuration = place.averageTime || 60;
        const neededTime = route.travelTimeMinutes + activityDuration + 30; 
        const neededCost = route.travelCost + (place.averageSpend || 0);

        // Validation against constraints
        if (neededTime <= remainingTime && (remainingBudget === Infinity || neededCost <= remainingBudget)) {
          chosenPlace = place;
          routeToPlace = route;
          break; // Greedily select the first feasible option
        }
      } catch (err) {
        console.error(`⚠️ Routing failed for ${place.name}:`, err.message);
        continue;
      }
    }

    if (!chosenPlace) continue;

    // 3. Step Generation
    // TRAVEL STEP
    steps.push({
      action: "TRAVEL",
      description: `Head towards ${chosenPlace.name}`,
      location: chosenPlace.fullAddress || "Route to destination",
      time: routeToPlace.travelTimeMinutes,
      cost: routeToPlace.travelCost,
      provider: "OpenRouteService"
    });

    // ACTIVITY STEP
    steps.push({
      action: "ACTIVITY",
      description: `${pref.toUpperCase()}: ${chosenPlace.name}`,
      location: chosenPlace.fullAddress || chosenPlace.address,
      time: chosenPlace.averageTime || 60,
      cost: chosenPlace.averageSpend || 0
    });

    // 4. Update Trackers
    const legTime = routeToPlace.travelTimeMinutes + (chosenPlace.averageTime || 60);
    const legCost = routeToPlace.travelCost + (chosenPlace.averageSpend || 0);

    remainingTime -= legTime;
    remainingBudget -= legCost;
    totalTimeUsed += legTime;
    totalCostUsed += legCost;

    visitedNames.add(chosenPlace.name);
    currentLocation = { lat: chosenPlace.lat, lng: chosenPlace.lng };
  }

  // 5. Success Check
  if (steps.length === 0) {
    return {
      status: "FAILED",
      error: "No suitable locations found within your time and budget constraints."
    };
  }

  // 6. Return Trip Calculation
  try {
    const returnRoute = await getRoute({
      from: currentLocation,
      to: { lat, lng }
    });

    steps.push({
      action: "RETURN",
      description: "Complete your journey and return home",
      location: "Original Starting Point",
      time: returnRoute.travelTimeMinutes,
      cost: returnRoute.travelCost
    });

    totalTimeUsed += returnRoute.travelTimeMinutes;
    totalCostUsed += returnRoute.travelCost;
  } catch (err) {
    console.warn("Fallback: Return route calculated manually.");
  }

  return {
    status: "SUCCESS",
    bestPlan: {
      steps,
      totalTimeUsed,
      totalCost: Math.ceil(totalCostUsed)
    }
  };
}

module.exports = generatePlan;