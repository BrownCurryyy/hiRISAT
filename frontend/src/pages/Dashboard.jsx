import { useState } from "react";
import Header from "../components/Header";
import SatelliteSelector from "../components/SatelliteSelector";
import GroundStationForm from "../components/GroundStationForm";
import PassTable from "../components/PassTable";

import { getPasses } from "../services/api";

export default function Dashboard() {
    const [satellite, setSatellite] = useState("RISAT-2B");
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPasses(satellite);
            setPasses(data);
        } catch (err) {
            console.error("Failed to fetch passes:", err);
            setError("Failed to fetch passes. Please check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <SatelliteSelector value={satellite} onChange={setSatellite} />
                <GroundStationForm onPredict={handlePredict} />
                <PassTable passes={passes} />
            </div>
        </>
    );
}
