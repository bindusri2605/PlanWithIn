import React from "react";

/**
 * PreferenceChips Component
 * A toggleable selection group for user travel interests.
 */
const PreferenceChips = ({ options, selected, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((pref) => {
        const isActive = selected.includes(pref);
        
        return (
          <button
            key={pref}
            type="button" // Prevents accidental form submission
            onClick={() => onToggle(pref)}
            className={`px-6 py-2.5 rounded-full capitalize text-sm font-bold transition-all duration-200 
              ${
                isActive
                  ? "bg-[#B2C5B2] text-white shadow-md shadow-[#B2C5B2]/30 scale-105"
                  : "bg-white/10 text-white/60 border border-white/5 hover:bg-white/20"
              }
            `}
          >
            {pref}
          </button>
        );
      })}
    </div>
  );
};

export default PreferenceChips;