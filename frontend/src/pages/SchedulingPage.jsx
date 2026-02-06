import { useEffect, useState } from "react";
import { getSchedule, getStations } from "../services/api";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

export default function SchedulingPage() {
    const [schedule, setSchedule] = useState({});
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [scheduled, setScheduled] = useState([]);
    const [dropped, setDropped] = useState([]);
    const [totalDuration, setTotalDuration] = useState(0);
    const [utilization, setUtilization] = useState(0);
    const [stationMeta, setStationMeta] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const [scheduleData, stationsData] = await Promise.all([
                getSchedule(),
                getStations()
            ]);
            setSchedule(scheduleData);
            setStations(stationsData.stations || []);
            if (stationsData.stations?.length > 0) {
                setSelectedStation(stationsData.stations[0].name);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    // Calculate metrics for the bottom panel
    useEffect(() => {
        if (selectedStation && schedule[selectedStation]) {
            const currentPasses = schedule[selectedStation];
            const scheduledPasses = currentPasses.filter(p => p.status === 'scheduled');
            const droppedPasses = currentPasses.filter(p => p.status === 'dropped');

            const totalDurationSec = scheduledPasses.reduce((sum, p) => sum + p.duration, 0);
            const totalAvailableTimeSec = 24 * 60 * 60; // 24 hours in seconds
            const currentUtilization = (totalDurationSec / totalAvailableTimeSec * 100).toFixed(1);

            setScheduled(scheduledPasses);
            setDropped(droppedPasses);
            setTotalDuration(totalDurationSec);
            setUtilization(currentUtilization);

            // Update station meta if selectedStation changes
            const currentStation = stations.find(s => s.name === selectedStation);
            if (currentStation) {
                setStationMeta({ lat: currentStation.lat, lon: currentStation.lon });
            }
        } else {
            // Reset stats if no station selected or no data
            setScheduled([]);
            setDropped([]);
            setTotalDuration(0);
            setUtilization(0);
            setStationMeta(null);
        }
    }, [selectedStation, schedule, stations]);


    if (loading) return <LoadingView />;

    const activePasses = selectedStation ? schedule[selectedStation] || [] : [];

    return (
        <div style={{
            height: "calc(100vh - 120px)", // Adjusted to fit in layout without global scroll
            width: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxSizing: "border-box",
            position: "relative",
            left: "50%",
            marginLeft: "-50vw",
            width: "98vw" // Breakout of container mostly
        }}>
            {/* --- HEADER SECTION --- */}
            <div style={{ marginBottom: "1rem", flexShrink: 0, padding: "0 2rem" }}>


                {/* Station Tabs */}
                <div style={{
                    display: "flex",
                    gap: "0.6rem",
                    overflowX: "auto",
                    paddingBottom: "5px",
                    scrollbarWidth: "none",
                    justifyContent: "center"
                }}>
                    {stations.map(station => (
                        <StationTab
                            key={station.name}
                            station={station}
                            isSelected={selectedStation === station.name}
                            onClick={() => setSelectedStation(station.name)}
                        />
                    ))}
                </div>
            </div>

            {/* --- STATS PANEL (Moved Below Tabs) --- */}
            <div style={{
                flexShrink: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "1rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "0 2rem 1rem 2rem", // Inset margin
                boxSizing: "border-box"
            }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                    <StatItem label="Station" value={selectedStation} color="#eee" />
                    <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.1)" }} />
                    <StatItem label="Utilization" value={utilization + "%"} color="var(--accent-gold)" />
                    <StatItem label="Active Hours" value={(totalDuration / 3600).toFixed(1) + "h"} />
                    <div style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.1)" }} />
                    <StatItem label="Scheduled" value={scheduled.length} color="#4ECDC4" />
                    <StatItem label="Conflicts" value={dropped.length} color="#FF6B6B" />
                </div>

                <div style={{ fontSize: "0.8rem", color: "#666", textAlign: "right" }}>
                    <div>LAT: {stationMeta?.lat?.toFixed(2)}° LON: {stationMeta?.lon?.toFixed(2)}°</div>
                    <div style={{ marginTop: "4px", color: "var(--accent-gold)", opacity: 0.7 }}>Auto-Optimization Active</div>
                </div>
            </div>

            {/* --- MAIN CONTENT: GRID --- */}
            <div
                className="hide-scrollbar" // Custom class for hiding scrollbar
                style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gridAutoRows: "min-content",
                    gap: "1rem",
                    overflowY: "auto",
                    padding: "0 2rem 2rem 2rem", // Bottom padding for scroll space
                    alignContent: "start",
                    borderRadius: "8px",
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none"  // IE/Edge
                }}
            >
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                <LayoutGroup>
                    <AnimatePresence>
                        {activePasses.map((pass, idx) => (
                            <PassCard key={`${selectedStation}-${pass.satellite}-${idx}`} pass={pass} />
                        ))}
                    </AnimatePresence>
                </LayoutGroup>

                {activePasses.length === 0 && (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "#444" }}>
                        <h3>No passes scheduled for this station.</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- COMPONENTS ---

function StatItem({ label, value, color }) {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.75rem", color: "#666", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", fontFamily: "monospace", color: color || "#ccc" }}>{value}</span>
        </div>
    );
}

function StationTab({ station, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: isSelected ? "rgba(212, 175, 55, 0.15)" : "rgba(255,255,255,0.03)",
                border: isSelected ? "1px solid var(--accent-gold)" : "1px solid rgba(255,255,255,0.1)",
                color: isSelected ? "var(--accent-gold)" : "#888",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: isSelected ? "600" : "400",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease"
            }}
        >
            {station.name}
        </button>
    );
}

function PassCard({ pass }) {
    const [isHovered, setHovered] = useState(false);

    const isDropped = pass.status === "dropped";
    const satColor = getSatColor(pass.satellite);
    const borderColor = isDropped ? "#ff4d4d" : satColor;

    // Duration formatting
    const durMin = Math.floor(pass.duration / 60);
    const durSec = Math.round(pass.duration % 60);

    return (
        <motion.div
            layout
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
                background: isDropped ? "rgba(50,0,0,0.3)" : "rgba(0,0,0,0.4)",
                backdropFilter: "blur(10px)",
                borderRadius: "10px",
                border: `1px solid ${isHovered ? borderColor : "rgba(255,255,255,0.08)"}`,
                boxShadow: isHovered
                    ? `0 0 15px ${borderColor}33`
                    : "none",
                padding: "1rem",
                position: "relative",
                cursor: "pointer",
                height: "fit-content",
                zIndex: isHovered ? 10 : 1,
                overflow: "hidden"
            }}
        >
            {/* Top Right Indicator */}
            <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isDropped ? "#ff4d4d" : "#4ECDC4",
                boxShadow: `0 0 8px ${isDropped ? "#ff4d4d" : "#4ECDC4"}`
            }} />

            {/* Header: Sat Name */}
            <div style={{ marginBottom: "0.5rem", paddingRight: "15px" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#fff", letterSpacing: "0.5px" }}>
                    {pass.satellite}
                </h3>
            </div>

            {/* Time / Duration */}
            <div style={{ fontFamily: "monospace", color: "#ccc", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                {formatTime(pass.rise)} — {formatTime(pass.set)}
            </div>

            {/* Primary Metric */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#888" }}>
                <span>Max El: <span style={{ color: "#eee" }}>{pass.max_elevation.toFixed(1)}°</span></span>
                <span>{durMin}m {durSec}s</span>
            </div>

            {/* EXPANDED CONTENT */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ marginTop: "0.8rem", paddingTop: "0.6rem", borderTop: "1px dashed rgba(255,255,255,0.1)" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.75rem" }}>
                            <div>
                                <span style={{ color: "#666" }}>Mean El</span>
                                <div style={{ color: "#ddd" }}>{pass.mean_elevation.toFixed(1)}°</div>
                            </div>
                            <div>
                                <span style={{ color: "#666" }}>Direction</span>
                                <div style={{ color: "#ddd" }}>{pass.direction}</div>
                            </div>
                        </div>

                        {/* Conflict Reason */}
                        {isDropped && (
                            <div style={{ marginTop: "0.6rem", color: "#ff9999", fontSize: "0.75rem" }}>
                                ⚠ {pass.reason}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function LoadingView() {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                    width: "50px", height: "50px",
                    borderRadius: "50%",
                    border: "3px solid var(--accent-gold)",
                    borderTopColor: "transparent",
                    marginBottom: "1rem"
                }}
            />
            <div style={{ color: "#888", letterSpacing: "2px", fontSize: "0.8rem" }}>CALCULATING ORBITS...</div>
        </div>
    );
}

function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getSatColor(name) {
    const colors = {
        "RISAT-1": "#FF6B6B",   // Red
        "RISAT-2B": "#4ECDC4",  // Teal
        "RISAT-2BR1": "#45B7D1",// Blue
        "RISAT-2BR2": "#96CEB4" // Sage
    };
    return colors[name] || "#ccc";
}
