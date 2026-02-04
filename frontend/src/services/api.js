const API_URL = import.meta.env.VITE_API_URL || "";
// We use relative paths for Vercel/proxies, but VITE_API_URL can be used for absolute overrides.


export async function getPasses(satelliteName, stationName = "Bengaluru") {
    const res = await fetch(`/api/passes?sat=${satelliteName}&station=${stationName}`);
    return res.json();
}

export async function getStations() {
    try {
        const res = await fetch(`/api/stations`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch stations:", error);
        return { stations: [] };
    }
}

export async function getSystemStatus() {
    try {
        const res = await fetch(`/api/status`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch status:", error);
        return { last_updated: null };
    }
}
