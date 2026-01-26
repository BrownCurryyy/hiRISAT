import { motion, AnimatePresence } from "framer-motion";

export default function PassTable({ passes }) {
    if (passes.length === 0) return null;

    const formatToIST = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Next Passes (IST)</h3>
            {/* Removed overflowX to show full table */}
            <div>
                <table style={{ minWidth: '100%', tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '28%', padding: '1rem 0.5rem', textAlign: 'left' }}>Rise (IST)</th>
                            <th style={{ width: '28%', padding: '1rem 0.5rem', textAlign: 'left' }}>Peak (IST)</th>
                            <th style={{ width: '28%', padding: '1rem 0.5rem', textAlign: 'left' }}>Set (IST)</th>
                            <th style={{ width: '16%', padding: '1rem 0.5rem', textAlign: 'right' }}>Max El</th>
                        </tr>
                    </thead>
                    <tbody style={{ position: 'relative' }}>
                        <AnimatePresence mode='wait'>
                            {passes.map((p, i) => (
                                <motion.tr
                                    key={`${p.rise}-${i}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                                >
                                    <td style={{ padding: '1rem 0.5rem' }}>{formatToIST(p.rise)}</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>{formatToIST(p.peak)}</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>{formatToIST(p.set)}</td>
                                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right', color: p.max_elevation > 70 ? '#4caf50' : p.max_elevation > 40 ? '#ffeb3b' : '#ff9800', fontWeight: 'bold' }}>
                                        {typeof p.max_elevation === 'number' ? p.max_elevation.toFixed(1) : p.max_elevation}&deg;
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
