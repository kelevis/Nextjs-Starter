"use client";
import React, { useEffect, useState } from 'react';
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import Link from "next/link";

interface Transfer {
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
    from: string;
    to: string;
    value: string;
}

const USDTMonitor: React.FC = () => {
    const {dispatch, state: {status, isMetamaskInstalled, wallet},} = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！")

    }, []);

    const [transfers, setTransfers] = useState<Transfer[]>([]);

    const fetchTransfers = async () => {
        try {
            const response = await fetch('api/monitor-BNB-log', { cache: 'no-store' });
            const data = await response.json();
            setTransfers(data.transfers);

            console.log("response:", response);
            console.log("data:", data);
            console.log("data.transfers:", data.transfers);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        }
    };

    useEffect(() => {
        fetchTransfers();
        const interval = setInterval(fetchTransfers, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-900 text-white p-6">

            <Link href="https://etherscan.io/address/0xdac17f958d2ee523a2206206994597c13d831ec7" >
                <h1 className="text-4xl text-fuchsia-400 font-bold mb-6 text-center">
                    USDT Transfer Monitor
                </h1>
            </Link>

            {Array.isArray(transfers) && transfers.length > 0 ? (
                <div className="space-y-6">
                    {transfers.map((transfer, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 border border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold text-sm">Block Number:</span>
                                    <p className="text-fuchsia-200 break-words">
                                        {transfer.blockNumber}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Block Hash:</span>
                                    <p className="text-fuchsia-200 break-words">
                                        {transfer.blockHash}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Transaction Hash:</span>
                                    <p className="text-fuchsia-200 break-words">
                                        {transfer.transactionHash}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">From:</span>
                                    <p className="text-green-400 break-words">
                                        {transfer.from}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">To:</span>
                                    <p className="text-red-400 break-words">
                                        {transfer.to}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Value (in Wei):</span>
                                    <p className="text-yellow-400 break-words">
                                        {transfer.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">Loading transfers...</p>
            )}
        </div>
    );
};

export default USDTMonitor;
