import { motion } from "framer-motion";

const StepCard = ({ index, step }) => {
  // Helper to ensure we don't show "0m" or "₹0" if data is missing
  const hasTime = step.time && step.time > 0;
  const hasCost = step.cost && step.cost > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white text-[#2C3E50] rounded-[2rem] p-7 border-l-[12px] border-[#B2C5B2] shadow-xl flex items-start gap-5 hover:translate-x-1 transition-transform"
    >
      {/* Step Number Badge */}
      <div className="w-10 h-10 rounded-2xl bg-[#2C3E50] text-[#B2C5B2] flex-shrink-0 flex items-center justify-center font-black text-lg">
        {index + 1}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#B2C5B2] uppercase mb-1">
            {step.action || "VISIT"}
          </p>
        </div>

        <h3 className="text-xl font-black tracking-tight leading-tight">
          {step.description}
        </h3>

        {/* RECTIFICATION: 
            Only render the location if it exists AND is not an empty string.
            This removes the "No address provided" or "Nearby" placeholders.
        */}
        {step.location && step.location.trim() !== "" && (
          <p className="text-xs text-gray-400 mt-1 font-bold italic">
            📍 {step.location}
          </p>
        )}

        <div className="flex items-center gap-3 mt-5">
          {/* Time Estimate */}
          <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1.5 rounded-full text-gray-500 flex items-center gap-1">
            ⏱ {hasTime ? `${step.time}m` : "--"}
          </span>

          {/* Cost Estimate */}
          <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1.5 rounded-full text-gray-500 flex items-center gap-1">
            💰 {hasCost ? `₹${step.cost}` : "Free"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StepCard;