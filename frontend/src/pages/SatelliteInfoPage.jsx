import { useState } from "react";
import { RISAT_DETAILS } from "../data/risat_details";
import { motion, AnimatePresence } from "framer-motion";

export default function SatelliteInfoPage() {
    const [activeSat, setActiveSat] = useState("RISAT-1");
    const details = RISAT_DETAILS[activeSat];

    return (
        <div style={{ display: 'flex', gap: '2rem', minHeight: '600px', flexDirection: 'row', flexWrap: 'wrap' }}>
            {/* Sidebar */}
            <div style={{
                flex: '0 0 250px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                paddingRight: '1rem'
            }}>
                <h3 className="text-gold" style={{ fontSize: '1.2rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Fleet List</h3>
                {Object.keys(RISAT_DETAILS).map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveSat(key)}
                        style={{
                            textAlign: 'left',
                            padding: '1rem',
                            background: activeSat === key ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.1), transparent)' : 'transparent',
                            borderLeft: activeSat === key ? '3px solid var(--accent-gold)' : '3px solid transparent',
                            borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                            color: activeSat === key ? 'var(--accent-gold)' : '#aaa',
                            fontWeight: activeSat === key ? 'bold' : 'normal',
                            borderRadius: '0 8px 8px 0',
                            transition: 'all 0.2s'
                        }}
                    >
                        {RISAT_DETAILS[key].name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeSat}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="card"
                        style={{ height: '100%', boxSizing: 'border-box' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '2rem', color: '#fff' }}>{details.name}</h2>
                            <span style={{
                                fontSize: '0.8rem',
                                border: '1px solid var(--glass-border)',
                                padding: '0.3rem 0.6rem',
                                borderRadius: '20px',
                                color: '#888'
                            }}>
                                {details.launchDate}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <InfoItem label="Launch Vehicle" value={details.vehicle} />
                            <InfoItem label="Orbit" value={details.orbit} />
                            <InfoItem label="Mission Life" value={details.missionLife} />
                            <InfoItem label="Application" value={details.application} />
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ marginTop: 0, color: 'var(--accent-gold)' }}>Mission Description</h4>
                            <p style={{ lineHeight: '1.6', color: '#ccc' }}>{details.description}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <div style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{value}</div>
        </div>
    );
}
