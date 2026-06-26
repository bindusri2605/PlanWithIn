# 🚀 PlanWithIn

### Discover your day, optimized.

**PlanWithIn** is a full-stack smart itinerary generator designed for people who find themselves stuck in unfamiliar places — train delays, airport layovers, unexpected free time, or exploring a new city.

Instead of endlessly searching what to do, PlanWithIn detects your location, understands your constraints (time, budget, preferences), and generates an optimized real-world activity plan — instantly.

---

## 🧩 Problem Statement

Modern travel disruptions and spontaneous downtime often leave people stranded in unfamiliar environments with no clear way to utilize their time productively.

Whether waiting at a railway station due to delays, managing jet lag at an airport, or navigating an unknown city, users lack tools that combine **location awareness, time constraints, cost awareness, and personal interests** into a single decision system.

**PlanWithIn solves this by:**

* Detecting real-time location
* Discovering nearby activities
* Estimating travel time and cost
* Generating structured itineraries
* Providing fallback plans when constraints are tight

It transforms uncertainty into structured exploration.

---

## 🌐 Live Demo

```
https://plan-with-in.vercel.app/
```

---

## ✨ Features

### 📍 Real-Time Geolocation

Automatically detects the user’s live position and discovers nearby places using real-world map data.

### ⏱️ Smart Time Optimization

Allocates activity durations and incorporates travel buffers to prevent unrealistic scheduling.

### 💰 Budget-Aware Planning

Supports flexible spending strategies:

* Any Budget
* Under Budget
* Custom Limits

### 🎯 Preference Mapping

Personalized filtering based on interests:

* Eating
* Shopping
* Peace
* Games
* Reading
* Sightseeing

### 🧭 Intelligent Fallback Logic

If constraints are too strict, the system generates the closest feasible alternative plan.

### 📱 Fully Responsive UI

Smooth experience across desktop, tablet, and mobile devices.

### 🔐 Authentication System

Secure user login & account handling for session continuity and future history tracking.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### APIs

* OpenStreetMap Nominatim
* Geolocation API

### Deployment

* Vercel — Frontend
* Render — Backend

---

## 🧱 System Architecture

User → React UI
→ Sends preferences + constraints
→ Node/Express backend
→ Fetches nearby places via Maps API
→ Computes time/cost logic
→ Returns optimized itinerary
→ Animated guided results UI

---

## 📂 Project Structure

```
PlanWithIn/
│
├── frontend/          # React client (UI + animations)
├── backend/           # Express server (routing + planning logic)
├── components/        # Reusable UI blocks
├── pages/             # App screens
└── README.md
```

---

## ⚙️ Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/PlanWithIn.git
cd PlanWithIn
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## 🧠 Future Enhancements

* Route optimization using graph algorithms
* ML-based preference prediction
* Saved itinerary history
* Offline mode
* Multi-day trip planning
* Public transport integration
* Google Maps navigation handoff

---

## 👩‍💻 Author

**Sahithi B**
Aspiring Full-Stack Engineer

Built to explore the intersection of:

* real-world problem solving
* location intelligence
* UI experience design
* optimization logic

---

## ⭐ Contribution

Contributions, issues, and feature requests are welcome!

If you like the project:

⭐ Star the repo
🍴 Fork it
🚀 Build on it
