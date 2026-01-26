import { SATELLITES } from "../data/satellites";

export default function SatelliteSelector({ value, onChange }) {
    return (
        <div className="card">
            <h3>Select Satellite</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {SATELLITES.map((sat) => (
                    <button
                        key={sat.noradId}
                        onClick={() => onChange(sat.name)}
                        style={{
                            flex: 1,
                            backgroundColor: value === sat.name ? 'var(--accent-gold)' : 'rgba(255, 215, 0, 0.05)',
                            color: value === sat.name ? '#000' : 'var(--accent-gold)',
                            boxShadow: value === sat.name ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none',
                            transform: value === sat.name ? 'scale(1.05)' : 'scale(1)'
                        }}
                    >
                        {sat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
