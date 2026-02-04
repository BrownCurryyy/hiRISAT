import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SatelliteSelector from "../components/SatelliteSelector";
import GroundStationSwitcher from "../components/GroundStationSwitcher";
import PassTable from "../components/PassTable";
import Countdown from "../components/Countdown";
import { getPasses, getStations } from "../services/api";

export default function Home() {
    const [satellite, setSatellite] = useState("RISAT-1");
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPass, setNextPass] = useState(null);
    const [stations, setStations] = useState([]);
    const [currentStation, setCurrentStation] = useState(null);

    // Initial stations fetch
    useEffect(() => {
        async function fetchStations() {
            try {
                const data = await getStations();
                if (data && Array.isArray(data.stations)) {
                    setStations(data.stations);
                    if (data.stations.length > 0) {
                        setCurrentStation(data.stations[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch stations:", err);
            }
        }
        fetchStations();
    }, []);

    // Auto-predict when satellite or station changes
    useEffect(() => {
        if (currentStation) {
            handlePredict();
        }
    }, [satellite, currentStation]);

    const handlePredict = async () => {
        if (!currentStation) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getPasses(satellite, currentStation.name);
            if (Array.isArray(data)) {
                setPasses(data);
                // Find next upcoming pass
                const now = new Date();
                const upcoming = data.find(p => new Date(p.rise) > now);
                setNextPass(upcoming || null);
            } else {
                setPasses([]);
                setNextPass(null);
            }
        } catch (err) {
            console.error("Failed to fetch passes:", err);
            setError("Failed to fetch passes. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
                <h2 style={{
                    fontSize: '3rem',
                    fontWeight: '300',
                    letterSpacing: '2px',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #fff, #aaa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {satellite}
                </h2>
                <motion.div
                    style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '0 auto', opacity: 0.6 }}
                    layoutId="underline"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Left Column: Controls & Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <SatelliteSelector value={satellite} onChange={setSatellite} />
                    <Countdown nextPass={nextPass} />
                    {stations.length > 0 ? (
                        <GroundStationSwitcher
                            stations={stations}
                            currentStation={currentStation}
                            onStationChange={setCurrentStation}
                        />
                    ) : (
                        <div className="card" style={{ opacity: 0.5 }}>
                            <p>Loading Ground Stations...</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Pass Table */}
                <div style={{ flex: 1 }}>
                    {loading && (
                        <motion.div
                            className="card text-center"
                            style={{ padding: '3rem' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--accent-gold)', borderRadius: '50%', marginRight: '10px', animation: 'pulse 1s infinite' }}></span>
                            Processing Orbital Data...
                        </motion.div>
                    )}
                    {error && <div className="card text-center" style={{ borderColor: 'red', color: '#ff6b6b' }}>{error}</div>}
                    {!loading && !error && <PassTable passes={passes} />}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </motion.div>
    );
}
