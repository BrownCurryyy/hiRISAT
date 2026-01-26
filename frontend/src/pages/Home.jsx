import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SatelliteSelector from "../components/SatelliteSelector";
import GroundStationForm from "../components/GroundStationForm";
import PassTable from "../components/PassTable";
import Countdown from "../components/Countdown";
import { getPasses } from "../services/api";

export default function Home() {
    const [satellite, setSatellite] = useState("RISAT-1");
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPass, setNextPass] = useState(null);

    // Auto-predict when satellite changes
    useEffect(() => {
        handlePredict();
    }, [satellite]);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPasses(satellite);
            setPasses(data);

            // Find next upcoming pass
            const now = new Date();
            const upcoming = data.find(p => new Date(p.rise) > now);
            setNextPass(upcoming || null);
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
                    <GroundStationForm />
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
