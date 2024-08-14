// app/page.tsx
import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
    const [metrics, setMetrics] = useState<{
        pv: number;
        uv: number;
        bounceRate: number;
        avgSessionDuration: string;
        pageDepth: number;
        conversionRate: number;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/metrics');
                if (!response.ok) {
                    throw new Error('Failed to fetch metrics');
                }
                const data = await response.json();
                setMetrics(data);
                setLoading(false);

                console.log("data:",data)

                // // Initialize elapsed time based on last visit
                // if (data.metrics.lastVisitDate) {
                //     console.log("data:",data)
                //     console.log("data.lastVisitDate",data.lastVisitDate)
                //     const lastVisitDate = new Date(data.lastVisit).getTime();
                //     setElapsedTime(Math.floor((Date.now() - lastVisitDate) / 1000));
                // }

            } catch (error) {
                setError('Error fetching metrics');
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(() => {
            setElapsedTime(pre => pre + 1);
            console.log("ElapsedTime:",elapsedTime)
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval


    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

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


                    {/*<div className="p-4 border rounded shadow">*/}
                    {/*    <h2 className="text-xl font-semibold">跳出率</h2>*/}
                    {/*    <p>{metrics.bounceRate}%</p>*/}
                    {/*</div>*/}

                    {/*<div className="p-4 border rounded shadow">*/}
                    {/*    <h2 className="text-xl font-semibold">页面浏览深度</h2>*/}
                    {/*    <p>{metrics.pageDepth.toFixed(1)}</p>*/}
                    {/*</div>*/}
                    {/*<div className="p-4 border rounded shadow">*/}
                    {/*    <h2 className="text-xl font-semibold">转化率</h2>*/}
                    {/*    <p>{metrics.conversionRate}%</p>*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    );
};

export default HomePage;
