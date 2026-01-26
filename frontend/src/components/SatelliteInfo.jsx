export default function SatelliteInfo() {
    return (
        <div className="card">
            <h3>RISAT Fleet Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 className="text-gold" style={{ marginTop: 0 }}>RISAT-1</h4>
                    <p style={{ fontSize: '0.85rem' }}>First indigenous radar imaging satellite. C-band SAR.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 className="text-gold" style={{ marginTop: 0 }}>RISAT-2B</h4>
                    <p style={{ fontSize: '0.85rem' }}>Replaced RISAT-2. X-band SAR for all-weather surveillance.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 className="text-gold" style={{ marginTop: 0 }}>RISAT-2BR1</h4>
                    <p style={{ fontSize: '0.85rem' }}>Enhanced resolution. Disaster management & agriculture.</p>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 className="text-gold" style={{ marginTop: 0 }}>RISAT-2BR2</h4>
                    <p style={{ fontSize: '0.85rem' }}>Latest in the series. Advanced X-band SAR capabilities.</p>
                </div>
            </div>
        </div>
    );
}
