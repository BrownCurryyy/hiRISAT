import { useState, useEffect } from "react";
import { getSystemStatus } from "../services/api";

export default function Header() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        async function fetchStatus() {
            const status = await getSystemStatus();
            if (status && status.last_updated) {
                setLastUpdated(new Date(status.last_updated));
            }
        }
        fetchStatus();
    }, []);

    const formatTime = (date, timeZone) => {
        return date.toLocaleTimeString("en-GB", {
            timeZone,
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const istTime = formatTime(currentTime, "Asia/Kolkata");
    const utcTime = formatTime(currentTime, "UTC");

    return (
        <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1>ISRO LEO Satellite Pass Predictor</h1>
                <p>Ground Station Visibility Simulator</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <div className="clock">
                    <strong>IST:</strong> {istTime} <span style={{ opacity: 0.7 }}>(UTC: {utcTime})</span>
                </div>
                {lastUpdated && (
                    <div className="status" style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: '#4caf50' }}>
                        TLE Data Updated: {lastUpdated.toLocaleString()}
                    </div>
                )}
            </div>
        </header>
    );
}
