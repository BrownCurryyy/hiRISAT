export default function GroundStationForm({ onPredict }) {
    return (
        <div className="card">
            <h3>Ground Station</h3>
            <p>Bangalore (12.9716° N, 77.5946° E)</p>
            <button onClick={onPredict}>Predict Passes</button>
        </div>
    );
}
