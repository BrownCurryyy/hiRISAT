r# hiRISAT - ISRO RISAT Pass Predictor


A modern, web-based satellite tracking application focused on ISRO’s **Radar Imaging Satellite (RISAT)** constellation. 

![logo](frontend/src/assets/logo.png)

## Features
- **Real-time Pass Prediction**  
  Accurate rise, peak, and set timings for RISAT satellites using SGP4 propagation.
- **Automated TLE Updates**  
  Orbital data is fetched from CelesTrak every 24 hours to maintain prediction accuracy.
- **Modern Glass UI**  
  A clean “Space Black” interface with subtle animations and gold accents.
- **IST & UTC Support**  
  Built-in clocks, time conversion, and countdown timers for upcoming passes.
- **Fleet Intelligence**  
  Mission background and status information for each tracked RISAT satellite.

## Supported Satellites
- RISAT-1
- RISAT-2B
- RISAT-2BR1
- RISAT-2BR2

> Some RISAT satellites are not publicly trackable due to orbital decay or restricted
> availability of TLE data.

## Tech Stack
- **Frontend**: React, Vite, Framer Motion, React Icons
- **Backend**: FastAPI, Python (SGP4, APScheduler)

## Production Deployment

### 1. Backend (Railway)
1. Push your code to a GitHub repository.
2. Connect the repository to [Railway](https://railway.app/).
3. Railway will detect the `backend/Procfile` and start the server.
4. Add any environment variables if needed (e.g., custom ports).

### 2. Frontend (Vercel)
1. Connect your repository to [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `frontend`.
3. Add an Environment Variable: `VITE_API_URL` set to your Railway backend URL (e.g., `https://your-backend.up.railway.app`).
4. Vercel will build and deploy the app using the `frontend/vercel.json` for routing.

## About the Project
I love everything about ISRO and satellites now.
