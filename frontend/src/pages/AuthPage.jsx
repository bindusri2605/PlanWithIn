import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Back to direct import

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // --- RESTORED ALERT FUNCTIONALITY ---
  const showToast = (message, icon) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE}/api/auth/${endpoint}`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      
      showToast(isLogin ? "Welcome back!" : "Account created successfully!", "success");
      navigate("/home");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong. Please try again.";
      
      // Integrated SweetAlert2 modal for errors
      Swal.fire({
        title: "Oops!",
        text: errorMessage,
        icon: "error",
        background: "#2C3E50",
        color: "#ffffff",
        confirmButtonColor: "#B2C5B2",
        confirmButtonText: "Try Again",
        borderRadius: "24px"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C3E50] flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 rounded-2xl bg-[#B2C5B2] flex items-center justify-center text-white font-bold text-2xl">P</div>
        </div>
        
        <h2 className="text-3xl font-black text-white text-center mb-2">
          {isLogin ? "Welcome Back" : "Join PlanWithIn"}
        </h2>
        <p className="text-white/50 text-center mb-8 text-sm">
          {isLogin ? "Log in to view your saved trips" : "Start optimizing your travel today"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text" placeholder="Full Name" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-[#B2C5B2]"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input
            type="email" placeholder="Email Address" required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-[#B2C5B2]"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-[#B2C5B2]"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button 
            disabled={isLoading}
            className="w-full bg-[#B2C5B2] py-4 rounded-2xl font-bold text-white shadow-lg shadow-[#B2C5B2]/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>

        <p className="text-center mt-6 text-white/50 text-sm">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[#B2C5B2] font-bold">
            {isLogin ? "Register now" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;