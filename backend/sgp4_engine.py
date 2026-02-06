import numpy as np
from sgp4.api import Satrec, jday
from datetime import datetime, timezone

EARTH_RADIUS_KM = 6378.137
OMEGA_EARTH = 7.2921159e-5  # rad/s


def eci_to_ecef(r, t):
    theta = OMEGA_EARTH * t.timestamp()
    rot = np.array([
        [ np.cos(theta), np.sin(theta), 0],
        [-np.sin(theta), np.cos(theta), 0],
        [0, 0, 1]
    ])
    return rot @ np.array(r)


def geodetic_to_ecef(lat, lon, alt):
    lat = np.radians(lat)
    lon = np.radians(lon)
    r = EARTH_RADIUS_KM + alt

    x = r * np.cos(lat) * np.cos(lon)
    y = r * np.cos(lat) * np.sin(lon)
    z = r * np.sin(lat)

    return np.array([x, y, z])


def elevation_angle(sat_ecef, gs_ecef):
    diff = sat_ecef - gs_ecef
    zenith = gs_ecef / np.linalg.norm(gs_ecef)

    cos_el = np.dot(diff, zenith) / np.linalg.norm(diff)
    return np.degrees(np.arcsin(cos_el))


def satellite_elevation(tle1, tle2, time_utc, gs_lat, gs_lon, gs_alt):
    sat = Satrec.twoline2rv(tle1, tle2)

    jd, fr = jday(
        time_utc.year, time_utc.month, time_utc.day,
        time_utc.hour, time_utc.minute,
        time_utc.second + time_utc.microsecond * 1e-6
    )

    e, r, v = sat.sgp4(jd, fr) # Get velocity v as well
    if e != 0:
        return None, None

    sat_ecef = eci_to_ecef(r, time_utc)
    gs_ecef = geodetic_to_ecef(gs_lat, gs_lon, gs_alt)

    el = elevation_angle(sat_ecef, gs_ecef)
    
    # Determine direction based on z-velocity in ECI (simple approximation near equator/mid-lat)
    # v[2] > 0 is roughly Northbound (Ascending)
    direction = "Ascending" if v[2] > 0 else "Descending"
    
    return el, direction
