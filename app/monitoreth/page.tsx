"use client";
import React, { useEffect, useState } from 'react';
import { useMetamask } from "@/app/hooks/useMetamask";
import { useListen } from "@/app/hooks/useListen";
import Link from "next/link";

interface Transaction {
    blockNumber: string;
    blockHash: string;
    transactionHash: string;
    from: string;
    to: string;
    value: string; // Ether value in Wei
    gasPrice: string; // Gas price in Gwei
    gasLimit: string; // Gas limit
}

const EthTransactionMonitor: React.FC = () => {
    const {dispatch, state: {status, isMetamaskInstalled, wallet},} = useMetamask();
    const listen = useListen();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const fetchTransactions = async () => {
        try {
            const response = await fetch('api/monitor-eth-transactions', { cache: 'no-store' });
            const data = await response.json();
            setTransactions(data.transactions || []);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch transactions. Please try again.');
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-900 text-white p-6">
            <Link href="https://etherscan.io">
                <h1 className="text-4xl text-fuchsia-400 font-bold mb-6 text-center">
                    Ethereum Transaction Monitor
                </h1>
            </Link>

            {loading ? (
                <p className="text-center text-gray-400">Loading transactions...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="space-y-6">
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <div key={index} className="bg-gray-800 border border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-semibold text-sm">Block Number:</span>
                                        <p className="text-fuchsia-200 break-words">{transaction.blockNumber}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Block Hash:</span>
                                        <p className="text-fuchsia-200 break-words">{transaction.blockHash}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Transaction Hash:</span>
                                        <p className="text-fuchsia-200 break-words">{transaction.transactionHash}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">From:</span>
                                        <p className="text-green-400 break-words">{transaction.from}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">To:</span>
                                        <p className="text-red-400 break-words">{transaction.to}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Value (in Ether):</span>
                                        <p className="text-yellow-400 break-words">{transaction.value} ETH</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Gas Price (in Gwei):</span>
                                        <p className="text-blue-400 break-words">{transaction.gasPrice}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Gas Limit:</span>
                                        <p className="text-orange-400 break-words">{transaction.gasLimit}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No transactions found...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default EthTransactionMonitor;
