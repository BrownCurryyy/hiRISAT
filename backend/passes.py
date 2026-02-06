from datetime import datetime, timedelta, timezone
from sgp4_engine import satellite_elevation


def compute_passes(tle1, tle2, gs_lat, gs_lon, gs_alt):
    now = datetime.now(timezone.utc)
    end = now + timedelta(hours=24)

    step = timedelta(seconds=30)
    t = now

    passes = []
    in_pass = False
    current = {}

    while t < end:
        el, direction = satellite_elevation(tle1, tle2, t, gs_lat, gs_lon, gs_alt)

        if el is not None and el > 10:
            if not in_pass:
                in_pass = True
                current = {
                    "rise": t,
                    "max_el": el,
                    "peak": t,
                    "sum_el": el,
                    "count": 1,
                    "direction": direction # Capture direction at rise (start approximation)
                }
            else:
                current["sum_el"] += el
                current["count"] += 1
                if el > current["max_el"]:
                    current["max_el"] = el
                    current["peak"] = t
                    # Update direction at peak for better accuracy
                    current["direction"] = direction 
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
            "direction": p["direction"]
        }
        for p in passes
    ]
