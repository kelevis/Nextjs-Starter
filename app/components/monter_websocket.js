"use client";

import React, { useEffect, useState } from 'react';
import WebSocket from 'isomorphic-ws';

const USDTMonitor = () => {
    const [latestTransfer, setLatestTransfer] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLatestTransfer(data);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">USDT Transfer Monitor</h1>
            {latestTransfer && (
                <div className="flex justify-between border-b py-2">
                    <span>From: {latestTransfer.from}</span>
                    <span>To: {latestTransfer.to}</span>
                    <span>Value (Wei): {latestTransfer.value}</span>
                </div>
            )}
        </div>
    );
};

export default USDTMonitor;
