import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";

const HistoryPage = () => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // INTERNAL SAGE GREEN TOAST
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          showToast("Please log in to view history", "info");
          navigate("/auth");
          return;
        }

        const userData = JSON.parse(userStr);
        const response = await axios.get(`${API_BASE}/api/plans/history/${userData.userId}`);
        setSavedPlans(response.data); 
      } catch (error) {
        console.error("History Fetch Failure:", error);
        showToast("Could not load history", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate, API_BASE]);

  return (
    <div className="min-h-screen bg-[#2C3E50] p-6 md:p-12 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Travel History</h1>
            <p className="text-white/50 text-sm mt-1">Revisit your past optimized journeys</p>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => navigate("/home")} 
              className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold transition-all border border-white/5"
            >
              Back
            </button>
            <button 
              onClick={() => navigate("/home")} 
              className="flex-1 sm:flex-none bg-[#B2C5B2] hover:bg-[#9db09d] px-6 py-3 rounded-2xl font-bold text-[#2C3E50] shadow-lg shadow-[#B2C5B2]/20 transition-all"
            >
              + Create New
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-[#B2C5B2]/20 border-t-[#B2C5B2] rounded-full animate-spin"></div>
            <p className="opacity-50 font-medium tracking-widest uppercase text-[10px]">Retrieving adventures...</p>
          </div>
        ) : savedPlans.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10">
            <p className="text-xl opacity-40 font-medium">Your travel history is currently empty.</p>
            <button onClick={() => navigate("/home")} className="mt-6 text-[#B2C5B2] font-bold hover:underline">
              Start planning your first trip →
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-5">
            {savedPlans.map((plan, index) => (
              <motion.div 
                key={plan._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate("/plan", { state: { activePlan: plan } })}
                className="bg-white/10 p-7 rounded-[2rem] border border-white/10 cursor-pointer flex justify-between items-center group hover:bg-white/15 transition-all"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-black group-hover:text-[#B2C5B2] transition-colors tracking-tight">
                    {plan.address || "Saved Exploration"}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                    <span>{plan.steps?.length || 0} Steps</span>
                    <span className="w-1.5 h-1.5 bg-[#B2C5B2] rounded-full"></span>
                    <span>{plan.totalTimeUsed} Mins</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#B2C5B2]">₹{plan.totalCost}</p>
                  <p className="text-[10px] uppercase font-black opacity-30 group-hover:opacity-100 transition-opacity">Details →</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;