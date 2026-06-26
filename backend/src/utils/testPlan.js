const generatePlan = require("./planGenerator");

const userInput = {
  totalTime: 180,
  bufferTime: 30,
  budget: {
    type: "UNDER",
    amount: 1000
  },
  preference: "SHOPPING"
};

const places = [
  {
    name: "Forum Mall",
    category: "SHOPPING",
    averageSpend: 400,
    averageTime: 90,
    travelTimeFromStart: 20,
    travelCost: 50
  },
  {
    name: "Distant Mall",
    category: "SHOPPING",
    averageSpend: 700,
    averageTime: 120,
    travelTimeFromStart: 60,
    travelCost: 120
  }
];

const result = generatePlan(userInput, places);
console.log(result);
