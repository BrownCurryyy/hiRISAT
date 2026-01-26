from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import httpx
from datetime import datetime

from satellites import SATELLITES
from passes import compute_passes

# Ground Station Coordinates (Bengaluru by default)
GS_LAT = 12.9716
GS_LON = 77.5946
GS_ALT = 0.9  # km

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
def get_passes(sat: str):
    if sat not in SATELLITES:
        raise HTTPException(status_code=404, detail="Satellite not found")

    tle1, tle2 = SATELLITES[sat]["tle"]

    passes = compute_passes(
        tle1, tle2,
        GS_LAT, GS_LON, GS_ALT
    )

    return passes

@app.get("/status")
def get_status():
    return {"last_updated": last_updated}
