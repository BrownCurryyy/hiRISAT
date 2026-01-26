r# hiRISAT - ISRO RISAT Pass Predictor


A modern, web-based satellite tracking application focused on ISRO’s **Radar Imaging Satellite (RISAT)** constellation. 

## Features
- **Real-time Pass Prediction**: Precise upcoming visibility windows for the RISAT fleet.
- **Automated TLE Updates**: Intelligent every-24-hour orbital data synchronization from CelesTrak.
- **Modern Glass UI**: Sleek "Space Black" theme with gold accents and a clutter-free multi-page layout.
- **Countdown & IST Times**: Real-time IST/UTC clocks and countdown timers for incoming passes.
- **Fleet Intelligence**: Detailed mission information for the entire RISAT constellation.

## Supported Satellites
- RISAT-1, 1A, 1B
- RISAT-2, 2B, 2BR1, 2BR2

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, React Icons
- **Backend**: FastAPI, Python (SGP4, APScheduler)

## Quick Start

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> [!TIP]
> Create a `.env` file in the `frontend` folder with `VITE_API_URL=http://localhost:8000` to configure the backend connection.

## Running the App (Windows)
Simply run the startup script for a one-click launch:
```powershell
.\start_app.bat
```

## About the Project
hiRISAT was built by **Srivatsan S** out of a passion for space systems and orbital mechanics. It aims to simplify satellite tracking for students and hobbyists while maintaining high-end aesthetics.
