import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ message = "Finding the best plan for you" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#2C3E50] flex flex-col items-center justify-center text-white px-6"
    >
      {/* Premium Spinner */}
      <div className="relative mb-10">
        <div className="w-16 h-16 rounded-full border-4 border-[#B2C5B2]/10 border-t-[#B2C5B2] animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-[#B2C5B2]/30 animate-pulse"></div>
      </div>

      <motion.h2 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black mb-3 tracking-tight"
      >
        {message}
      </motion.h2>

      <p className="text-white/40 text-center max-w-xs text-sm font-medium leading-relaxed">
        Our AI is scanning local spots, calculating traffic logic, and balancing your budget...
      </p>
    </motion.div>
  );
};

export default LoadingScreen;