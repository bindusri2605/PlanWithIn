import React, { useState } from "react";
import axios from "axios";
import StepCard from "./StepCard";
import { toast } from "../utils/alerts"; // Standardized Sage Green alerts

/**
 * PlanResult Component
 * Displays the generated itinerary and handles the persistence of plans to the user's history.
 */
const PlanResult = ({ activePlan, planType, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);

  // Early exit if no plan data is passed
  if (!activePlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2C3E50] text-white/70">
        No plan data available. Please try generating a plan again.
      </div>
    );
  }

  const isFallback = planType === "fallback";

  /**
   * Handles the 'Save This Plan' action.
   * Persists the current itinerary to the database associated with the logged-in user.
   */
  const handleSavePlan = async () => {
    // 1. Retrieve user data from local storage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast("Please log in to save your plans", "info");
      return;
    }

    const userData = JSON.parse(userStr);
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

    setIsSaving(true);

    try {
      // 2. Structure the payload for the backend
      const payload = {
        userId: userData.userId,
        totalTimeUsed: activePlan.totalTimeUsed,
        totalCost: activePlan.totalCost,
        steps: activePlan.steps,
        address: activePlan.steps[0]?.location || "Local Trip"
      };

      await axios.post(`${API_BASE}/api/plans/save`, payload);
      
      // 3. Trigger professional Sage Green success toast
      toast("Journey saved to your history!");
    } catch (err) {
      console.error("Save Plan Error:", err);
      toast("Failed to save plan. Try again later.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C3E50] px-6 md:px-24 py-14 text-white">
      
      {/* HEADER SECTION */}
      <div className="max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {isFallback ? "Optimized Fallback Plan" : "Your Journey is Ready"}
        </h1>
        <p className="mt-4 text-lg text-white/70">
          {isFallback
            ? "We couldn't match all constraints, but this is your best available route."
            : "This itinerary perfectly aligns with your time, budget, and interests."}
        </p>
      </div>

      {/* TRIP SUMMARY CARD */}
      <div className="bg-white/95 text-[#2C3E50] rounded-3xl p-6 mb-14 border border-[#B2C5B2]/30 shadow-xl max-w-3xl">
        <div className="flex flex-wrap gap-8 text-sm font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">⏱ {activePlan.totalTimeUsed} mins</div>
          <div className="flex items-center gap-2">💰 ₹{activePlan.totalCost}</div>
          <div className="flex items-center gap-2">📍 {activePlan.steps.length} Stops</div>
        </div>
      </div>

      {/* ITINERARY STEPS LIST */}
      <div className="max-w-3xl space-y-6">
        {activePlan.steps.map((step, index) => (
          <StepCard key={index} index={index} step={step} />
        ))}
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-20 flex flex-col sm:flex-row gap-4 max-w-3xl">
        <button
          onClick={onBack}
          disabled={isSaving}
          className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-semibold border border-white/10 disabled:opacity-50"
        >
          Modify Preferences
        </button>

        <button
          onClick={handleSavePlan}
          disabled={isSaving}
          className="flex-1 py-4 rounded-2xl bg-[#B2C5B2] hover:bg-[#9db09d] text-white font-bold transition-all shadow-lg shadow-[#B2C5B2]/20 disabled:animate-pulse"
        >
          {isSaving ? "Saving..." : "Save to My History"}
        </button>
      </div>
    </div>
  );
};

export default PlanResult;