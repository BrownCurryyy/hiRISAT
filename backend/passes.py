import numpy as np
from datetime import datetime, timedelta, timezone
from sgp4_engine import satellite_elevation


def calculate_link_budget(range_km, freq_ghz, eirp_dbw, bitrate_mbps):
    # FSPL Calculation
    fspl = 20 * np.log10(range_km) + 20 * np.log10(freq_ghz) + 92.45
    
    # Atmospheric + Rain loss (simplified)
    l_atm = 0.5
    l_rain = 0.5
    
    # Ground station Grx (assumed standard 2.4m antenna)
    g_rx = 25.0 
    
    # Received Power
    pr_dbw = eirp_dbw - fspl - l_atm - l_rain + g_rx
    
    # Link Margin (Eb/No based)
    bitrate_bps = bitrate_mbps * 1e6
    eb_no = pr_dbw - 10 * np.log10(bitrate_bps) + 204 # 204 = -(-228.6 + 24.6)
    
    required_ebno = 10.0
    margin = eb_no - required_ebno
    
    return {
        "fspl": fspl,
        "received_power": pr_dbw,
        "link_margin": margin
    }


def compute_passes(tle1, tle2, gs_lat, gs_lon, gs_alt, sat_params=None):
    now = datetime.now(timezone.utc)
    end = now + timedelta(hours=24)

    step = timedelta(seconds=20) # Balanced step
    t = now

    passes = []
    in_pass = False
    current = {}

    while t < end:
        el, direction, range_km = satellite_elevation(tle1, tle2, t, gs_lat, gs_lon, gs_alt)

        if el is not None and el > 10:
            lb = None
            if sat_params:
                lb = calculate_link_budget(
                    range_km, 
                    sat_params["frequency_ghz"], 
                    sat_params["eirp_dbw"], 
                    sat_params["bitrate_mbps"]
                )

            if not in_pass:
                in_pass = True
                current = {
                    "rise": t,
                    "max_el": el,
                    "peak": t,
                    "sum_el": el,
                    "count": 1,
                    "direction": direction,
                    "max_margin": lb["link_margin"] if lb else -99,
                    "sum_margin": lb["link_margin"] if lb else 0,
                    "usable_seconds": step.total_seconds() if lb and lb["link_margin"] > 0 else 0,
                    "min_range": range_km
                }
            else:
                current["sum_el"] += el
                current["count"] += 1
                if range_km < current["min_range"]:
                    current["min_range"] = range_km
                if el > current["max_el"]:
                    current["max_el"] = el
                    current["peak"] = t
                    current["direction"] = direction 
                
                if lb:
                    if lb["link_margin"] > current["max_margin"]:
                        current["max_margin"] = lb["link_margin"]
                    current["sum_margin"] += lb["link_margin"]
                    if lb["link_margin"] > 0:
                        current["usable_seconds"] += step.total_seconds()
        else:
            if in_pass:
                current["set"] = t
                passes.append(current)
                in_pass = False

        t += step

    return [
        {
            "rise": p["rise"].isoformat(),
            "peak": p["peak"].isoformat(),
            "set": p["set"].isoformat(),
            "duration": (p["set"] - p["rise"]).total_seconds(),
            "max_elevation": p["max_el"],
            "mean_elevation": p["sum_el"] / p["count"],
            "direction": p["direction"],
            "peak_range_km": p["min_range"],
            "link_margin": p["max_margin"] if sat_params else None,
            "mean_margin": (p["sum_margin"] / p["count"]) if sat_params else None,
            "link_quality": ("Good" if p["max_margin"] > 5 else "Marginal" if p["max_margin"] > 0 else "Bad") if sat_params else "N/A",
            "usable_duration": p["usable_seconds"] if sat_params else 0,
            "estimated_data_mb": (p["usable_seconds"] * sat_params["bitrate_mbps"] / 8.0) if sat_params else 0
        }
        for p in passes
    ]
