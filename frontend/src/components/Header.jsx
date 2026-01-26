import { useState, useEffect } from "react";
import { getSystemStatus } from "../services/api";
import logo from "../assets/logo.png";

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
        <header className="header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(5, 5, 5, 0.8)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '1rem 2rem',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ width: '60px', height: '60px', marginRight: '1rem' }} />
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>hiRISAT</h1>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>ISRO Satellite Visibility Simulator</p>
                </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                <div className="clock" style={{ color: '#eee', fontFamily: 'Roboto Mono' }}>
                    <strong>IST:</strong> {istTime} <span style={{ opacity: 0.6, fontSize: '0.85em' }}>(UTC: {utcTime})</span>
                </div>
                {lastUpdated && (
                    <div className="status" style={{ fontSize: '0.75rem', marginTop: '0.3rem', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                        <span style={{ width: '8px', height: '8px', background: '#4caf50', borderRadius: '50%', display: 'inline-block' }}></span>
                        TLE Data Updated: {lastUpdated.toLocaleString()}
                    </div>
                )}
            </div>
        </header>
    );
}
