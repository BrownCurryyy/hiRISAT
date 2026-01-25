export default function PassTable({ passes }) {
    if (passes.length === 0) return null;

    return (
        <div className="card">
            <h3>Next Passes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Rise</th>
                        <th>Peak</th>
                        <th>Set</th>
                        <th>Max Elevation</th>
                    </tr>
                </thead>
                <tbody>
                    {passes.map((p, i) => (
                        <tr key={i}>
                            <td>{p.rise}</td>
                            <td>{p.peak}</td>
                            <td>{p.set}</td>
                            <td>{p.maxElevation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
