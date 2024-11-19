"use client"
import React, { useEffect, useState } from 'react';
import styles from '../monitorusdt/Home.module.css';
interface Transfer {
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
    from: string;
    to: string;
    value: string;
}

const USDTMonitor: React.FC = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    const fetchTransfers = async () => {
        try {
            const response = await fetch('api/monitor-BNB-log', { cache: 'no-store' });
            const data = await response.json();
            setTransfers(data.transfers);

            console.log("response:", response)
            console.log("data:", data)
            console.log("data.transfers:", data.transfers)
            // console.log("data:", data.transfers.length)
        } catch (error) {
            console.error('Error fetching transfers:', error);
        }
    };

    useEffect(() => {
        // Fetch initial transfers
        fetchTransfers();

        // Set up interval to fetch transfers every 1 second
        const interval = setInterval(fetchTransfers, 1000);

        return () => clearInterval(interval);  // Cleanup interval on component unmount
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-fuchsia-200 font-bold mb-4">USDT Transfer Monitor</h1>

            {Array.isArray(transfers) && (
                <div>
                    {transfers.map((transfer, index) => (
                        <div key={index} className="flex flex-col border-b py-2">
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">BlockNumber:</span>
                                <span className={styles.truncate} title={transfer.blockNumber}>{transfer.blockNumber}</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">BlockHash:</span>
                                <span className={styles.truncate} title={transfer.blockHash}>{transfer.blockHash}</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">TransactionHash:</span>
                                <span className={styles.truncate} title={transfer.transactionHash}>{transfer.transactionHash}</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">From:</span>
                                <span className={styles.truncate} title={transfer.from}>{transfer.from}</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">To:</span>
                                <span className={styles.truncate} title={transfer.to}>{transfer.to}</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <span className="font-bold mr-2">Value-Wei:</span>
                                <span className={styles.truncate} title={transfer.value}>{transfer.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default USDTMonitor;
