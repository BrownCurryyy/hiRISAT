import { SATELLITES } from "../data/satellites";

export default function SatelliteSelector({ value, onChange }) {
    return (
        <div className="card">
            <label>Satellite</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {SATELLITES.map((sat) => (
                    <option key={sat.noradId} value={sat.name}>
                        {sat.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
