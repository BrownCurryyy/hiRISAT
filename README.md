# hiRISAT - Satellite Pass Predictor

A full-stack application to predict satellite passes over a specific ground station.

## Features
- **Real-time Pass Prediction**: Calculate upcoming passes for ISRO satellites.
- **Automated TLE Updates**: Automatically fetches latest orbital data from Celestrak every 24 hours.
- **Field-Ready UI**: Dashboard with real-time IST/UTC clock and data freshness indicators.
- **Visual Dashboard**: Displays Rise, Peak, Set time, and Max Elevation.

## Supported Satellites
- RISAT-1
- RISAT-2B
- RISAT-2BR1
- RISAT-2BR2

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: FastAPI, Python (SGP4, APScheduler)

## Prerequisites
- Python 3.8+
- Node.js & npm
- Internet connection (for fetching TLE data)

## Setup

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## Running the App

For Windows users, simply run the startup script:

```powershell
.\start_app.bat
```

## Docker Support

You can also run the application using Docker:

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```

2. **Access**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
