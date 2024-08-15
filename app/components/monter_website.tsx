// app/page.tsx
import React, {useEffect, useState} from 'react';

interface Metrics {
    pv: number;
    uv: number;
}

const HomePage: React.FC = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    function setTime() {
        setElapsedTime(pre => pre + 1);
        console.log("ElapsedTime:", elapsedTime)
    }

    const fetchMetrics = async () => {
        try {
            const response = await fetch('/api/metrics-by-memory');
            if (!response.ok) {
                throw new Error('Failed to fetch metrics-by-disk');
            }
            const data = await response.json();
            setMetrics(data);
            setLoading(false);
            console.log("data:", data)


        } catch (error) {
            setError('Error fetching metrics-by-disk');
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchMetrics();
        const interval = setInterval(setTime, 1000);

        return () => clearInterval(interval); // Cleanup interval

    }, []);



    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">User Behavior Metrics</h1>
            {loading && <p>Loading metrics...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {metrics && (
                <div className="space-y-4">
                    <div className="p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold">访问量 (PV)</h2>
                        <p>{metrics.pv.toLocaleString()}</p>
                    </div>
                    <div className="p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold">访客数 (UV)</h2>
                        <p>{metrics.pv.toLocaleString()}</p>
                    </div>

                    <div className="p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold">访问时间</h2>
                        <p>{formatTime(elapsedTime)}</p>
                    </div>
                    <div className="p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold">平均访问时长</h2>
                        <p>{"04:56"}</p>
                    </div>


                </div>
            )}
        </div>
    );
};

export default HomePage;
