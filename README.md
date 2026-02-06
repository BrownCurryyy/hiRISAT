# hiRISAT

![alt text](assets/logo.png)
**The Advanced Mission Control Dashboard for ISRO's RISAT Constellation.**

hiRISAT is a high-precision satellite tracking and scheduling engine designed to bridge the gap between complex orbital mechanics and user-friendly design. It provides real-time pass predictions, conflict-free scheduling, and a sleek "Mission Control" interface for ground station operators and enthusiasts.

---

## 🚀 Modules

### 1. Pass Predictor (Home)
A real-time dashboard for tracking individual satellites.
- **Next Pass Countdown**: Prominent timer for the upcoming contact.
- **Live Orbit Data**: Calculates Elevation, Azimuth, and Range using SGP4 propagation.
- **Card-Based Grid**: View all upcoming passes in a clean, scrollable grid with expanding details (Mean Elevation, Orbit Direction).
- **Multi-Station Support**: Switch between multiple Ground Stations instantly.

### 2. Scheduling Dashboard
A comprehensive tool for managing ground station resources.
- **Conflict Detection**: Automatically identifies and flags overlapping passes across multiple satellites.
- **Optimization**: "Drops" conflicting passes based on priority (Max Elevation + Duration score) to ensure the best possible schedule.
- **Station Metrics**: Real-time stats on Utilization %, Active Hours, and Conflict Rates.
- **Visual Status**: Neon indicators for "Scheduled" (Cyan) vs "Dropped" (Red) passes.

### 3. Mission Status (About)
A dedicated space for project philosophy and developer insights.
- **Tech Stack Visualization**: Badges for the core technologies used.
- **Developer Profile**: Connect with the creator.

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BrownCurryyy/hiRISAT.git
   cd hiRISAT
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn app:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📡 Supported Satellites
- **RISAT-1** (Radar Imaging Satellite 1)
- **RISAT-2B** (X-Band SAR)
- **RISAT-2BR1**
- **RISAT-2BR2**

---
