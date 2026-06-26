const LoadingScreen = ({ message = "Finding the best plan for you" }) => {
  return (
    <div className="min-h-screen bg-[#2C3E50] flex flex-col items-center justify-center text-white px-6">
      
      <div className="w-14 h-14 rounded-full border-4 border-[#B2C5B2]/30 border-t-[#B2C5B2] animate-spin mb-8"></div>

      <h2 className="text-2xl font-bold mb-2">
        {message}
      </h2>

      <p className="text-white/70 text-center max-w-md">
        Searching nearby places, calculating travel time, and optimizing your preferences…
      </p>
    </div>
  );
};

export default LoadingScreen;
