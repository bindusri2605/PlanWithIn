import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import PlanPage from "./pages/PlanPage";
import HistoryPage from "./pages/HistoryPage";
import AuthPage from "./pages/AuthPage"; // Added the new AuthPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Users will now go here first to Login/Register */}
        <Route path="/auth" element={<AuthPage />} /> 
        <Route path="/home" element={<HomePage />} />
        <Route path="/plan" element={<PlanPage />} /> 
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;