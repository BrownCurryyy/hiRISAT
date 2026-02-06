from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import httpx
from datetime import datetime

from satellites import SATELLITES
from passes import compute_passes

# Ground Stations Metadata
GROUND_STATIONS = {
    "Bengaluru": {"lat": 12.9716, "lon": 77.5946, "alt": 0.9},
    "Lucknow": {"lat": 26.9123, "lon": 80.9561, "alt": 0.12},
    "Mauritius": {"lat": -20.1644, "lon": 57.5042, "alt": 0.008},
    "Sriharikota": {"lat": 13.7424, "lon": 80.2098, "alt": 0.011},
    "Port Blair": {"lat": 11.6683, "lon": 92.7378, "alt": 0.016},
    "Thiruvananthapuram": {"lat": 8.5241, "lon": 76.9366, "alt": 0.017},
    "Brunei": {"lat": 4.9403, "lon": 114.9481, "alt": 0.012},
    "Biak": {"lat": -1.1767, "lon": 136.0820, "alt": 0.156},
}

scheduler = AsyncIOScheduler()
last_updated = None

async def fetch_tles():
    global last_updated
    print(f"[{datetime.now()}] Starting TLE update...")
    async with httpx.AsyncClient() as client:
        for sat_name, data in SATELLITES.items():
            norad_id = data["norad_id"]
            url = f"https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=TLE"
            try:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
                lines = response.text.strip().splitlines()
                # Celestrak TLE format usually returns 3 lines: Name, Line 1, Line 2
                if len(lines) >= 3:
                     SATELLITES[sat_name]["tle"] = (lines[1], lines[2])
                     print(f"Updated {sat_name}")
                elif len(lines) == 2:
                     SATELLITES[sat_name]["tle"] = (lines[0], lines[1])
                     print(f"Updated {sat_name} (2-line format)")
                else:
                     print(f"Unexpected format for {sat_name}")
            except Exception as e:
                print(f"Error fetching TLE for {sat_name}: {e}")
    
    last_updated = datetime.now().isoformat()
    print(f"TLE update completed at {last_updated}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schedule TLE update every 24 hours
    scheduler.add_job(fetch_tles, "interval", hours=24)
    scheduler.start()
    
    # Fetch immediately on startup
    await fetch_tles()
    
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/passes")
def get_passes(sat: str, station: str = "Bengaluru"):
    if sat not in SATELLITES:
        raise HTTPException(status_code=404, detail="Satellite not found")
    
    if station not in GROUND_STATIONS:
        raise HTTPException(status_code=404, detail="Ground station not found")

    tle1, tle2 = SATELLITES[sat]["tle"]
    gs = GROUND_STATIONS[station]

    passes = compute_passes(
        tle1, tle2,
        gs["lat"], gs["lon"], gs["alt"]
    )

    return passes

@app.get("/stations")
def get_stations():
    return {
        "stations": [
            {"name": name, **coords} 
            for name, coords in GROUND_STATIONS.items()
        ]
    }

@app.get("/status")
def get_status():
    return {"last_updated": last_updated}

@app.get("/schedule")
def get_schedule():
    # 1. Collect all potential passes
    all_passes = {} # station -> list of passes
    
    for station_name, gs in GROUND_STATIONS.items():
        all_passes[station_name] = []
        for sat_name, sat_data in SATELLITES.items():
            tle1, tle2 = sat_data["tle"]
            # Calling compute_passes for each pair
            # Note: This computes for the *next* 24h from *now* each time called
            # Ideally we'd fix the 'now' time, but for this scale it's negligible
            raw_passes = compute_passes(tle1, tle2, gs["lat"], gs["lon"], gs["alt"])
            
            for p in raw_passes:
                # Add metadata we need for scheduling
                p["satellite"] = sat_name
                p["station"] = station_name
                # Calculate score: 70% elevation, 30% duration (normalized roughly)
                # Elevation 0-90, Duration 0-900s
                # Let's just use raw heuristic: Score = MaxEl + (Duration / 60)
                # E.g. 80deg + 10min = 90 score. 20deg + 5min = 25 score.
                p["score"] = p["max_elevation"] + (p["duration"] / 60.0)
                all_passes[station_name].append(p)

    # 2. Optimize per station
    optimized_schedule = {}
    
    for station_name, passes in all_passes.items():
        # Sort by score descending
        passes.sort(key=lambda x: x["score"], reverse=True)
        
        selected_passes = []
        
        for p in passes:
            # Check for overlap with already selected passes
            p_rise = datetime.fromisoformat(p["rise"])
            p_set = datetime.fromisoformat(p["set"])
            
            has_overlap = False
            for selected in selected_passes:
                s_rise = datetime.fromisoformat(selected["rise"])
                s_set = datetime.fromisoformat(selected["set"])
                
                # Overlap logic: (StartA <= EndB) and (EndA >= StartB)
                if (p_rise <= s_set) and (p_set >= s_rise):
                    has_overlap = True
                    break
            
            if not has_overlap:
                selected_passes.append(p)
                
        # Sort selected passes by time for the timeline
        selected_passes.sort(key=lambda x: x["rise"])
        optimized_schedule[station_name] = selected_passes

    return optimized_schedule
