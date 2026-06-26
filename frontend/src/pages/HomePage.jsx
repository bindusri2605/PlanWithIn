import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const preferencesList = [
  "eating",
  "shopping",
  "peace",
  "games",
  "reading",
  "sightseeing"
];

const HomePage = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [addressName, setAddressName] = useState("Detecting location...");
  const [error, setError] = useState("");

  const [totalTime, setTotalTime] = useState(180);
  const [bufferTime] = useState(30);

  const [budgetType, setBudgetType] = useState("ANY");
  const [budgetAmount, setBudgetAmount] = useState(500);

  const [preferences, setPreferences] = useState([]);
  const [status, setStatus] = useState("idle"); 

  /* ---------------- LOCATION & REVERSE GEOCODING ---------------- */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setLocation(coords);
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
          .then(res => res.json())
          .then(data => {
            const name = data.display_name.split(',').slice(0, 2).join(', ');
            setAddressName(name || "Amaravati, Andhra Pradesh");
          })
          .catch(() => setAddressName("Amaravati, Andhra Pradesh"));
      },
      () => setError("Location permission denied. Please enable location to use the app.")
    );
  }, []);

  const formatTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m} min`;
  };

  const togglePreference = (pref) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  /* ---------------- GENERATE PLAN ---------------- */
  const generatePlan = async () => {
    if (!location || status === "searching") return;

    setStatus("searching");
    setError("");

    // SMART URL SELECTION: Use Vercel variable if it exists, otherwise use Localhost
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    try {
      // Combined the URL variable with your specific endpoint path
      const res = await fetch(`${API_BASE_URL}/api/plans/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          totalTime,
          bufferTime,
          preferences,
          budget: budgetType === "ANY" ? { type: "ANY" } : { type: budgetType, amount: budgetAmount }
        })
      });

      const data = await res.json();
      const hasData = data && Object.keys(data).length > 0;

      if (!hasData) {
        setStatus("idle");
        setError("No suitable places found. Try increasing time or selecting different preferences.");
        return;
      }

      const activePlan = data;
      sessionStorage.setItem("planData", JSON.stringify({ activePlan, planType: "optimal" }));
      navigate("/plan", { state: { activePlan, planType: "optimal" } });
    } catch (err) {
      console.error("Generate Plan Error:", err);
      setStatus("idle");
      setError("Failed to connect to the server.");
    }
  };

  if (status === "searching") {
    return (
      <div className="min-h-screen bg-[#2C3E50] flex flex-col items-center justify-center text-white px-6">
        <div className="w-14 h-14 rounded-full border-4 border-[#B2C5B2]/30 border-t-[#B2C5B2] animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold mb-2">Finding the best plan for you</h2>
        <p className="text-white/70 text-center max-w-md">
          Searching nearby places in {addressName}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C3E50] px-6 md:px-24 py-12 text-white font-sans">
      
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-[#B2C5B2] flex items-center justify-center text-white font-bold shadow-lg shadow-[#B2C5B2]/20">P</div>
          <span className="text-2xl font-bold tracking-tight">PlanWithIn</span>
        </div>

        <button 
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2 rounded-2xl border border-white/10 transition-all group"
        >
          <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">My Saved Trips</span>
          <span className="text-[#B2C5B2] group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Discover your day, <br />
            <span className="text-[#B2C5B2]">optimized.</span>
          </h1>
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Context
            </h3>
            <div className="space-y-3 opacity-80 text-sm">
              <p>📍 {addressName}</p>
              <p>⏱ {formatTime(totalTime - bufferTime)} for activities</p>
              <p>🛡 {bufferTime} mins reserved for travel/delays</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white text-[#2C3E50] rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold mb-4 flex justify-between">
              Total Time <span>{formatTime(totalTime)}</span>
            </h4>
            <input
              type="range" min="60" max="720" step="30"
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
              className="w-full accent-[#B2C5B2]"
            />
          </div>

          <div className="bg-white text-[#2C3E50] rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold mb-4">Budget Strategy</h4>
            <div className="flex gap-2 mb-4">
              {["ANY", "UNDER"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBudgetType(b)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    budgetType === b ? "bg-[#2C3E50] text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
            {budgetType !== "ANY" && (
              <input
                type="number"
                step="100"
                placeholder="Enter amount (₹)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-[#B2C5B2] font-bold"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
              />
            )}
          </div>

          <div className="bg-white text-[#2C3E50] rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold mb-4">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {preferencesList.map((pref) => (
                <button
                  key={pref}
                  onClick={() => togglePreference(pref)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    preferences.includes(pref)
                      ? "bg-[#2C3E50] text-white"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generatePlan}
            disabled={!location}
            className={`w-full py-5 rounded-2xl text-lg font-black transition-all shadow-lg ${
              !location ? "bg-gray-500 cursor-not-allowed" : "bg-[#B2C5B2] hover:bg-[#8DA38D] text-white shadow-[#B2C5B2]/20"
            }`}
          >
            {location ? "Generate My Plan" : "Detecting Location..."}
          </button>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;