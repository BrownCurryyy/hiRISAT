from fastapi import FastAPI, HTTPException
from satellites import SATELLITES
from passes import compute_passes

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

GS_LAT = 12.9716
GS_LON = 77.5946
GS_ALT = 0.9  # km


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
