import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * LandingPage Component
 * Updated with professional Developer contact info in the footer.
 */
const LandingPage = () => {
  const navigate = useNavigate();

  // Animation variants for a smooth entrance
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden font-sans bg-white selection:bg-[#B2C5B2] selection:text-white">
      
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 h-full z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-1000"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1920')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60"></div>
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-8">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-11 h-11 rounded-2xl bg-[#B2C5B2] flex items-center justify-center text-white font-black text-xl shadow-xl shadow-[#B2C5B2]/40 transition-transform group-hover:rotate-12">
            P
          </div>
          <span className="text-2xl font-black tracking-tighter text-[#2C3E50]">
            PlanWithIn
          </span>
        </div>

        <button 
          onClick={() => navigate("/auth")}
          className="bg-[#2C3E50] text-white px-8 py-3 rounded-2xl text-sm font-black hover:bg-[#1a252f] transition-all shadow-xl hover:shadow-[#2C3E50]/20 hover:-translate-y-1 active:scale-95"
        >
          Login / Join
        </button>
      </nav>

      {/* HERO SECTION */}
      <motion.main 
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col justify-center flex-grow px-6 md:px-24 py-16 max-w-7xl"
      >
        <motion.div variants={fadeInUp} className="max-w-4xl">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black text-[#2C3E50] leading-[0.9] tracking-tighter">
            Stuck? <br />
            <span className="text-[#B2C5B2] drop-shadow-sm">We’ve got a plan.</span>
          </h1>

          <p className="mt-10 text-xl md:text-2xl text-[#2C3E50]/70 max-w-2xl leading-relaxed font-medium">
            Stop scrolling, start exploring.
            <br />Generate your optimal local itinerary in seconds. 
          </p>

          <div className="mt-14 flex">
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#B2C5B2] hover:bg-[#9db09d] text-white px-14 py-6 rounded-[2rem] text-xl font-black shadow-2xl shadow-[#B2C5B2]/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Find My Way 
              <span className="text-2xl">→</span>
            </button>
          </div>
        </motion.div>

        <div className="absolute right-0 bottom-20 hidden 2xl:block opacity-20 pointer-events-none">
          <svg width="600" height="200" viewBox="0 0 500 200" fill="none">
            <path d="M0 150C100 150 150 50 300 50C450 50 500 150 600 150" stroke="#B2C5B2" strokeWidth="8" strokeLinecap="round" strokeDasharray="20 20" />
          </svg>
        </div>
      </motion.main>

      {/* FOOTER - UPDATED WITH NAME AND EMAIL */}
      <footer className="relative z-10 bg-white/60 backdrop-blur-xl border-t border-[#B2C5B2]/10 py-12 px-6 md:px-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start space-y-2">
            <p className="text-[#2C3E50] font-black text-xl tracking-tighter">PlanWithIn</p>
            <div className="text-[#2C3E50]/40 text-[10px] font-black tracking-[0.2em] uppercase italic leading-relaxed text-center md:text-left">
              Built for the curious. Optimized for the bold.
              <br /> 
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[11px] font-black tracking-[0.15em] text-[#2C3E50]/50 uppercase">
            <a href="mailto:sahithi3105@gmail.com" className="hover:text-[#B2C5B2] transition-colors flex items-center gap-2">
              <span className="text-[#B2C5B2] text-sm">@</span> Contact
            </a>
            <a href="/" className="hover:text-[#B2C5B2] transition-colors">Privacy</a>
            <a href="/" className="hover:text-[#B2C5B2] transition-colors">Terms</a>
            <a href="/" className="hover:text-[#B2C5B2] transition-colors">API</a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;