"use client";

import React, { useEffect, useState } from 'react';
import WebSocket from 'isomorphic-ws';

const USDTMonitor = () => {
    const [transfers, setTransfers] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTransfers((prevTransfers) => {
                const updatedTransfers = [data, ...prevTransfers];
                return updatedTransfers.slice(0, 10); // Keep only the latest 10 transfers
            });
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
            <h1 className="text-fuchsia-200 font-bold mb-4">USDT Transfer Monitor</h1>
            {transfers.map((transfer, index) => (
                <div key={index} className="flex justify-between border-b py-2">
                    <span className="font-bold">    From: {transfer.from}</span>
                    <span className="font-bold">    To: {transfer.to}</span>
                    <span className="font-bold">    Value-Wei: </span>{transfer.value}
                </div>
            ))}
        </div>
    );
};

export default USDTMonitor;
