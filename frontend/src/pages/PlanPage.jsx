import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import StepCard from "./StepCard"; 
import Swal from "sweetalert2";

const PlanPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [planData, setPlanData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message, icon = "success") => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#2C3E50",
      color: "#ffffff",
    });
    Toast.fire({ icon, title: message });
  };

  const showAlert = (title, text, icon = "error") => {
    Swal.fire({
      title, text, icon,
      background: "#2C3E50", color: "#ffffff",
      confirmButtonColor: "#B2C5B2", borderRadius: "24px"
    });
  };

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} min`;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

useEffect(() => {
  const raw = state?.activePlan || JSON.parse(sessionStorage.getItem("planData") || "{}")?.activePlan;
  
  if (!raw) {
    navigate("/home", { replace: true });
    return;
  }

  let sourcePlan = raw.bestPlan ? raw.bestPlan : raw;

  const processedSteps = (sourcePlan.steps || []).map((s, idx) => {
    const safeName = s.name || s.description || "";
    const nameLower = safeName.toLowerCase();
    const isTravel = nameLower.includes('travel');
    const isReturn = nameLower.includes('return') || nameLower.includes('complete');

    // CASCADING FALLBACK LOGIC
    // 1. Try specific return key -> 2. Try general travel key -> 3. Try general cost key -> 4. Default
    const stepCost = isReturn 
      ? (Number(s.travelCostToStart) || Number(s.travelCost) || Number(s.cost) || 0)
      : isTravel 
      ? (Number(s.travelCost) || Number(s.cost) || 0)
      : (Number(s.averageSpend) || Number(s.cost) || 0);

    const stepTime = isReturn
      ? (Number(s.travelTimeToStart) || Number(s.travelTimeFromStart) || Number(s.duration) || Number(s.time) || 0)
      : isTravel
      ? (Number(s.travelTimeFromStart) || Number(s.duration) || Number(s.time) || 0)
      : (Number(s.averageTime) || Number(s.time) || 0);

    return {
      action: isTravel ? "TRANSPORT" : isReturn ? "END" : (s.category || "VISIT"),
      description: safeName || "Activity",
      location: (isTravel || isReturn) ? "" : (s.city || s.location || ""),
      time: Math.round(stepTime),
      cost: Math.round(stepCost)
    };
  });

  // Calculate totals purely from what is displayed to ensure 100% accuracy in header
  const totalTimeUsed = processedSteps.reduce((sum, s) => sum + s.time, 0);
  const totalCost = processedSteps.reduce((sum, s) => sum + s.cost, 0);

  const sanitizedPlan = {
    totalTimeUsed,
    totalCost,
    steps: processedSteps
  };

  setPlanData({ activePlan: sanitizedPlan, planType: state?.planType || "optimal" });
  sessionStorage.setItem("planData", JSON.stringify({ activePlan: sanitizedPlan }));
}, [state, navigate]);

  const handleSaveItinerary = async () => {
    if (!planData?.activePlan) return;
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userId) {
      showToast("Login to save journeys", "info");
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        userId: userData.userId,
        totalTimeUsed: planData.activePlan.totalTimeUsed,
        totalCost: planData.activePlan.totalCost,
        steps: planData.activePlan.steps,
        address: state?.addressName || "Exploration Trip"
      };
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${API_BASE_URL}/api/plans/save`, payload);
      if (response.data.status === "SUCCESS") {
        showToast("Trip saved to history!");
        navigate("/history");
      }
    } catch (error) {
      showAlert("Save Failed", "Ensure the server is running.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!planData) return null;
  const { activePlan, planType } = planData;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#2C3E50] px-6 md:px-24 py-14 text-white font-sans">
      <div className="mb-14 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="w-10 h-10 rounded-xl bg-[#B2C5B2] flex items-center justify-center text-[#2C3E50] font-black shadow-lg shadow-[#B2C5B2]/20">P</div>
          <span className="text-2xl font-black tracking-tighter">PlanWithIn</span>
        </div>
        <button onClick={() => navigate("/home")} className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest transition-all">
          ← Reset
        </button>
      </div>

      <div className="max-w-3xl mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
          {planType === "fallback" ? "Alternative Found." : "Day Mapped."}
        </h1>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 mb-14 max-w-3xl border border-white/10 shadow-2xl flex justify-between items-center text-center">
        <div className="flex-1">
          <p className="text-[10px] uppercase font-black text-[#B2C5B2] mb-1 tracking-[0.2em]">Time</p>
          <p className="text-2xl font-black">{formatTime(activePlan.totalTimeUsed)}</p>
        </div>
        <div className="flex-1 border-x border-white/10">
          <p className="text-[10px] uppercase font-black text-[#B2C5B2] mb-1 tracking-[0.2em]">Budget</p>
          <p className="text-2xl font-black">₹{activePlan.totalCost}</p>
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase font-black text-[#B2C5B2] mb-1 tracking-[0.2em]">Steps</p>
          <p className="text-2xl font-black">{activePlan.steps.length}</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {activePlan.steps.map((step, i) => (
          <StepCard key={i} index={i} step={step} />
        ))}
      </div>

      <div className="mt-20 flex flex-col md:flex-row gap-4 max-w-3xl pb-20">
        <button onClick={() => navigate("/home")} className="flex-1 py-5 rounded-2xl bg-white/5 border border-white/5 font-bold hover:bg-white/10 transition-all">
          Modify
        </button>
        <button onClick={handleSaveItinerary} disabled={isSaving} className={`flex-1 py-5 rounded-2xl font-black shadow-xl transition-all ${isSaving ? "opacity-50" : "bg-[#B2C5B2] text-[#2C3E50] hover:scale-105"}`}>
          {isSaving ? "Archiving..." : "Save Itinerary"}
        </button>
      </div>
    </motion.div>
  );
};

export default PlanPage;