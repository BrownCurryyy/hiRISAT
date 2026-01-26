const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not defined");
}

export async function getPasses(satelliteName) {
    const res = await fetch(`${API_URL}/passes?sat=${satelliteName}`);
    return res.json();
}

export async function getSystemStatus() {
    try {
        const res = await fetch(`${API_URL}/status`);
        return res.json();
    } catch (error) {
        console.error("Failed to fetch status:", error);
        return { last_updated: null };
    }
}
