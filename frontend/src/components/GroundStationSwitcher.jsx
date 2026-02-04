import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0,
        scale: 0.95,
    }),
};

export default function GroundStationSwitcher({ stations, currentStation, onStationChange }) {
    const [[page, direction], setPage] = useState([0, 0]);

    if (!stations || stations.length === 0 || !currentStation) return null;

    const currentIndex = stations.findIndex(s => s.name === currentStation.name);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;

    const paginate = (newDirection) => {
        const nextIndex = (safeIndex + newDirection + stations.length) % stations.length;
        setPage([page + newDirection, newDirection]);
        onStationChange(stations[nextIndex]);
    };

    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Ground Station</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => paginate(-1)}
                        className="nav-btn"
                        aria-label="Previous Station"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="nav-btn"
                        aria-label="Next Station"
                    >
                        →
                    </button>
                </div>
            </div>

            <div style={{ position: 'relative', height: '65px', display: 'flex', alignItems: 'center' }}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentStation.name}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                            scale: { duration: 0.2 }
                        }}
                        style={{ position: 'absolute', width: '100%' }}
                    >
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '300', color: 'var(--accent-gold)', letterSpacing: '0.5px' }}>
                            {currentStation.name}
                        </p>
                        <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#666', fontFamily: 'Roboto Mono' }}>
                            {typeof currentStation.lat === 'number' ? currentStation.lat.toFixed(4) : '0.0000'}° N,
                            {typeof currentStation.lon === 'number' ? currentStation.lon.toFixed(4) : '0.0000'}° E
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
                Refresh interval: 24h
            </div>

            <style>{`
                .nav-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: var(--accent-gold);
                    color: var(--accent-gold);
                    transform: translateY(-1px);
                }
                .nav-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
}
