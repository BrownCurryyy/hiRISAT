import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { getPasses, getStations } from "../services/api";

export default function Home() {
    // --- STATE ---
    const [satellite, setSatellite] = useState("RISAT-1");
    const [passes, setPasses] = useState([]);
    const [stations, setStations] = useState([]);
    const [currentStation, setCurrentStation] = useState(null);
    const [nextPass, setNextPass] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- FETCH STATIONS ---
    useEffect(() => {
        async function fetchStations() {
            try {
                const data = await getStations();
                if (data?.stations?.length > 0) {
                    setStations(data.stations);
                    setCurrentStation(data.stations[0]);
                }
            } catch (err) { console.error(err); }
        }
        fetchStations();
    }, []);

    // --- FETCH PASSES ---
    useEffect(() => {
        if (currentStation) handlePredict();
    }, [satellite, currentStation]);

    const handlePredict = async () => {
        if (!currentStation) return;
        setLoading(true);
        try {
            const data = await getPasses(satellite, currentStation.name);
            if (Array.isArray(data)) {
                setPasses(data);
                const now = new Date();
                setNextPass(data.find(p => new Date(p.rise) > now) || null);
            } else {
                setPasses([]); setNextPass(null);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // --- RENDER ---
    return (
        <div style={{
            height: "calc(100vh - 120px)", // Main container height
            width: "100%",
            display: "flex",
            overflow: "hidden",
            boxSizing: "border-box",
            padding: "0 2rem",
            position: "relative",
            left: "50%",
            marginLeft: "-50vw",
            width: "98vw" // Wider breakout
        }}>

            {/* --- LEFT PANEL: INFO --- */}
            <div style={{
                width: "280px", // Slightly narrower
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                paddingRight: "2rem",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                paddingTop: "1rem"
            }}>
                {/* Title */}
                <div>
                    <div style={{ fontSize: "0.8rem", color: "#666", letterSpacing: "1px" }}>TARGET</div>
                    <h1 style={{
                        fontSize: "2.5rem", fontWeight: "300", letterSpacing: "2px", margin: "0",
                        background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>
                        {satellite}
                    </h1>
                </div>

                {/* Next Pass Countdown Card */}
                <div style={{
                    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
                    padding: "1.5rem", textAlign: "center"
                }}>
                    <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: "0.5rem" }}>NEXT PASS IN</div>
                    {nextPass ? (
                        <CountdownTimer targetDate={nextPass.rise} />
                    ) : (
                        <div style={{ color: "#666" }}>--:--:--</div>
                    )}
                </div>

                {/* Station Info */}
                {currentStation && (
                    <div style={{ fontSize: "0.9rem", color: "#666", lineHeight: "1.6" }}>
                        <div>STATION: <span style={{ color: "#fff" }}>{currentStation.name}</span></div>
                        <div>LAT: {currentStation.lat?.toFixed(2)}°</div>
                        <div>LON: {currentStation.lon?.toFixed(2)}°</div>
                    </div>
                )}
            </div>

            {/* --- RIGHT PANEL: CONTENT --- */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                paddingLeft: "2rem"
            }}>
                {/* Header Row: Satellites (center) */}
                <div style={{ display: "flex", paddingBottom: "1rem", gap: "0.8rem", alignItems: "center" }}>
                    {["RISAT-1", "RISAT-2B", "RISAT-2BR1", "RISAT-2BR2"].map(sat => (
                        <button
                            key={sat}
                            onClick={() => setSatellite(sat)}
                            style={{
                                background: satellite === sat ? "var(--accent-gold)" : "rgba(255,255,255,0.05)",
                                color: satellite === sat ? "#000" : "#aaa",
                                border: "none",
                                padding: "0.6rem 1.5rem",
                                borderRadius: "30px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                transition: "all 0.2s",
                                justifyContent: "flex-end"
                            }}
                        >
                            {sat}
                        </button>
                    ))}
                </div>

                {/* Station Tabs (Left) - Matching Scheduling Page Style */}
                <div style={{
                    display: "flex", gap: "0.6rem", overflowX: "auto",
                    paddingBottom: "15px", marginBottom: "0.5rem", scrollbarWidth: "none"
                }}>
                    {stations.map(station => (
                        <button
                            key={station.name}
                            onClick={() => setCurrentStation(station)}
                            style={{
                                background: currentStation?.name === station.name ? "rgba(212, 175, 55, 0.15)" : "rgba(255,255,255,0.03)",
                                border: currentStation?.name === station.name ? "1px solid var(--accent-gold)" : "1px solid rgba(255,255,255,0.1)",
                                color: currentStation?.name === station.name ? "var(--accent-gold)" : "#888",
                                padding: "0.5rem 1rem",
                                borderRadius: "20px",
                                fontSize: "0.85rem",
                                fontWeight: currentStation?.name === station.name ? "600" : "400",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {station.name}
                        </button>
                    ))}
                </div>

                {/* Scrollable Pass Grid */}
                <div
                    className="hide-scrollbar"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                        gridAutoRows: "min-content",
                        gap: "1.2rem",
                        paddingBottom: "2rem",
                        paddingRight: "10px"
                    }}
                >
                    <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                    <LayoutGroup>
                        <AnimatePresence>
                            {loading ? (
                                <div style={{ color: "#666", gridColumn: "1/-1", paddingTop: "2rem" }}>Calculating orbital trajectories...</div>
                            ) : passes.length > 0 ? (
                                passes.map((pass, idx) => (
                                    <PassCard key={idx} pass={pass} isNext={pass === nextPass} />
                                ))
                            ) : (
                                <div style={{ color: "#444", gridColumn: "1/-1", paddingTop: "2rem" }}>No upcoming passes found.</div>
                            )}
                        </AnimatePresence>
                    </LayoutGroup>
                </div>
            </div>
        </div>
    );
}

// --- SUBCOMPONENTS ---

function CountdownTimer({ targetDate }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const target = new Date(targetDate);
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("NOW");
            } else {
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${h}h ${m}m ${s}s`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff", fontFamily: "monospace" }}>{timeLeft}</div>;
}

function PassCard({ pass, isNext }) {
    const [hover, setHover] = useState(false);

    // Calculate simple duration
    const start = new Date(pass.rise);
    const end = new Date(pass.set);
    const duration = Math.round((end - start) / 1000);
    const durMin = Math.floor(duration / 60);
    const durSec = duration % 60;

    const isPast = new Date() > end;

    return (
        <motion.div
            layout
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isPast ? 0.5 : 1, scale: 1 }}
            style={{
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                border: isNext ? "1px solid var(--accent-gold)" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: "8px",
                padding: "1.2rem",
                cursor: "default",
                position: "relative",
                boxShadow: isNext ? "0 0 20px rgba(212,175,55,0.1)" : "none"
            }}
        >
            {isNext && <div style={{ position: "absolute", top: 10, right: 10, fontSize: "0.7rem", color: "var(--accent-gold)", fontWeight: "bold" }}>NEXT</div>}

            <div style={{ fontSize: "0.8rem", color: "#888", marginBottom: "0.2rem" }}>
                {start.toLocaleDateString()}
            </div>
            <div style={{ fontSize: "1.4rem", color: "#fff", fontWeight: "300", marginBottom: "1rem" }}>
                {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                    <div style={{ fontSize: "0.7rem", color: "#666" }}>MAX EL</div>
                    <div style={{ color: "#ddd" }}>{pass.max_elevation.toFixed(1)}°</div>
                </div>
                <div>
                    <div style={{ fontSize: "0.7rem", color: "#666" }}>DURATION</div>
                    <div style={{ color: "#ddd" }}>{durMin}m {durSec}s</div>
                </div>
            </div>

            {/* EXPANDED DETAILS */}
            <AnimatePresence>
                {hover && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed rgba(255,255,255,0.1)", overflow: "hidden" }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div>
                                <div style={{ fontSize: "0.7rem", color: "#666" }}>MEAN EL</div>
                                <div style={{ color: "#ddd" }}>{pass.mean_elevation?.toFixed(1) || "-"}°</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.7rem", color: "#666" }}>DIRECTION</div>
                                <div style={{ color: "#ddd" }}>{pass.direction || "-"}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
