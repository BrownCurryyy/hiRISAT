export async function getPasses(satelliteName) {
    const res = await fetch(`http://localhost:8000/passes?sat=${satelliteName}`);
    return res.json();
}
