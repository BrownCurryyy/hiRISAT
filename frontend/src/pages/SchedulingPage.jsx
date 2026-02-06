import { useEffect, useState } from "react";
import { getSchedule, getStations } from "../services/api";

export default function SchedulingPage() {
    const [schedule, setSchedule] = useState({});
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [scheduleData, stationsData] = await Promise.all([
                getSchedule(),
                getStations()
            ]);
            setSchedule(scheduleData);
            setStations(stationsData.stations || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "4rem", color: "#aaa" }}>
                <h2>Optimization in progress...</h2>
                <p>Calculating conflict-free schedules for all stations.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem 0" }}>
            <header style={{ marginBottom: "3rem", textAlign: "center" }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                    background: "-webkit-linear-gradient(45deg, #eee, #aaa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>
                    Ground Station Schedule
                </h1>
                <p style={{ maxWidth: "600px", margin: "0 auto", color: "#888", lineHeight: "1.6" }}>
                    Automated conflict resolution optimizer. Prioritizes contacts based on
                    <strong style={{ color: "var(--accent-gold)" }}> elevation</strong>,
                    <strong style={{ color: "var(--accent-gold)" }}> duration</strong>, and
                    station availability.
                </p>
            </header>

            <div style={{ display: "grid", gap: "2rem" }}>
                {Object.entries(schedule).map(([stationName, passes]) => {
                    const stationMeta = stations.find(s => s.name === stationName);

                    return (
                        <div key={stationName} style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1.5rem",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                paddingBottom: "1rem"
                            }}>
                                <h2 style={{ fontSize: "1.2rem", margin: 0, color: "#ddd" }}>
                                    {stationName}
                                </h2>
                                {stationMeta && (
                                    <div style={{ fontSize: "0.8rem", color: "#666", display: "flex", gap: "1rem" }}>
                                        <span>LAT: {stationMeta.lat.toFixed(2)}°</span>
                                        <span>LON: {stationMeta.lon.toFixed(2)}°</span>
                                        <span>ALT: {stationMeta.alt}km</span>
                                    </div>
                                )}
                            </div>

                            {passes.length === 0 ? (
                                <p style={{ color: "#555", fontStyle: "italic" }}>No passes scheduled.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                    {passes.map((pass, idx) => (
                                        <PassCard key={idx} pass={pass} />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PassCard({ pass }) {
    const rise = new Date(pass.rise);
    const set = new Date(pass.set);
    const now = new Date();
    const isActive = now >= rise && now <= set;

    const durationMin = Math.floor(pass.duration / 60);
    const durationSec = Math.round(pass.duration % 60);

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 1fr 1fr 100px",
            alignItems: "center",
            background: isActive ? "rgba(255, 215, 0, 0.05)" : "rgba(0, 0, 0, 0.2)",
            padding: "1rem",
            borderRadius: "8px",
            borderLeft: `4px solid ${getSatColor(pass.satellite)}`,
            gap: "1rem"
        }}>
            <div style={{ fontWeight: "bold", color: isActive ? "var(--accent-gold)" : "#ccc" }}>
                {pass.satellite}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "#666" }}>START</span>
                <span style={{ fontFamily: "monospace", color: "#aaa" }}>
                    {rise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "#666" }}>END</span>
                <span style={{ fontFamily: "monospace", color: "#aaa" }}>
                    {set.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "#666" }}>METRICS</span>
                <span style={{ fontSize: "0.85rem", color: "#bbb" }}>
                    El: {pass.max_elevation.toFixed(1)}° <br />
                    Dur: {durationMin}m {durationSec}s
                </span>
            </div>

            <div style={{ textAlign: "right" }}>
                {isActive && (
                    <span style={{
                        background: "var(--accent-gold)",
                        color: "#000",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        fontWeight: "bold"
                    }}>
                        ACTIVE
                    </span>
                )}
            </div>
        </div>
    );
}

function getSatColor(name) {
    // Consistent colors for satellites
    const colors = {
        "RISAT-1": "#FF6B6B",
        "RISAT-2B": "#4ECDC4",
        "RISAT-2BR1": "#45B7D1",
        "RISAT-2BR2": "#96CEB4"
    };
    return colors[name] || "#ccc";
}
