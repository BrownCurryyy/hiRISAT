import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Countdown({ nextPass }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!nextPass) {
            setTimeLeft("No upcoming passes predicted.");
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const riseTime = new Date(nextPass.rise); // Ensure backend sends ISO string
            const diff = riseTime - now;

            if (diff <= 0) {
                setTimeLeft("Pass in progress or completed.");
                clearInterval(interval);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextPass]);

    return (
        <motion.div
            className="card text-center"
            style={{ border: '1px solid var(--accent-gold)' }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <h3 style={{ marginBottom: '0.5rem' }}>Next Pass Countdown</h3>
            <div style={{ fontSize: '2.5rem', fontFamily: 'Roboto Mono', color: '#fff', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}>
                <AnimatePresence mode='wait'>
                    <motion.span
                        key={timeLeft}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.8 }}
                        transition={{ duration: 0.1 }}
                    >
                        {timeLeft}
                    </motion.span>
                </AnimatePresence>
            </div>
            {nextPass && (
                <div style={{ marginTop: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                    Incoming: {new Date(nextPass.rise).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (IST)
                </div>
            )}
        </motion.div>
    );
}
