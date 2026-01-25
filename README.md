# hiRISAT - Satellite Pass Predictor

A full-stack application to predict satellite passes over a specific ground station.

## Features
- Real-time satellite pass prediction.
- Visual dashboard with pass details (Rise, Peak, Set time, Max Elevation).
- Support for multiple satellites.

## Supported Satellites
- RISAT-2B
- RISAT-2BR2

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: FastAPI, Python (SGP4)

## Prerequisites
- Python 3.8+
- Node.js & npm

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

