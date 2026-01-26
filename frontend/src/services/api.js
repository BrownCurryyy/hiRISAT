export async function getPasses(satelliteName) {
    const res = await fetch(`http://localhost:8000/passes?sat=${satelliteName}`);
    return res.json();
}

export async function getSystemStatus() {
    try {
        const res = await fetch("http://localhost:8000/status");
        return res.json();
    } catch (error) {
        console.error("Failed to fetch status:", error);
        return { last_updated: null };
    }
}
