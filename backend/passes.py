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
        el = satellite_elevation(tle1, tle2, t, gs_lat, gs_lon, gs_alt)

        if el is not None and el > 10:
            if not in_pass:
                in_pass = True
                current = {
                    "rise": t,
                    "max_el": el,
                    "peak": t
                }
            else:
                if el > current["max_el"]:
                    current["max_el"] = el
                    current["peak"] = t
        else:
            if in_pass:
                current["set"] = t
                passes.append(current)
                in_pass = False

        t += step

    return [
        {
            "rise": p["rise"].strftime("%H:%M UTC"),
            "peak": p["peak"].strftime("%H:%M UTC"),
            "set": p["set"].strftime("%H:%M UTC"),
            "maxElevation": f"{p['max_el']:.1f}°"
        }
        for p in passes
    ]
