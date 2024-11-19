"use client";
import React, { useEffect, useState } from "react";
import { useMetamask } from "@/app/hooks/useMetamask";
import { useListen } from "@/app/hooks/useListen";
import Link from "next/link";
import {Button, Input, Textarea} from "@nextui-org/react";

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
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet },
    } = useMetamask();
    const listen = useListen();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [seachLoading, setSeachLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchHash, setSearchHash] = useState<string>(""); // 输入的交易哈希
    const [searchResult, setSearchResult] = useState<Transaction | null>(null); // 搜索结果

    const fetchTransactions = async () => {
        try {
            const response = await fetch("api/monitor-eth-transactions", {
                cache: "no-store",
            });
            const data = await response.json();
            setTransactions(data.transactions || []);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch transactions. Please try again.");
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchHash.trim()) return;

        try {
            setSeachLoading(true);
            const response = await fetch(`/api/search-transaction?hash=${encodeURIComponent(searchHash)}`);
            const data = await response.json();

            if (response.ok) {
                setSearchResult(data);
            } else {
                setSearchResult(null);
                setError(data.error || "Failed to fetch transaction.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setSearchResult(null);
        } finally {
            setSeachLoading(false);
        }
    };


    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled =
                ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const { wallet, balance } = local
                ? JSON.parse(local)
                : { wallet: null, balance: null };
            dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
        }
        console.log("连接metamask成功！");
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

            {/* 搜索交易 */}
            <div className="mb-6 flex  text-center">
                <Input
                    type="text"
                    placeholder="Enter transaction hash"
                    variant="bordered"
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="p-3 rounded-md"
                />
                <Button
                    onClick={handleSearch}
                    color="primary"
                    variant="flat"
                    className="mt-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-3 rounded-md"
                >
                    Search
                </Button>
            </div>


            {

                seachLoading ? (
                    <p className="text-center text-gray-400">Loading search transactions...</p>
                ):(searchResult && (
                <div className="bg-gray-700 border border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2">
                    <h2 className="text-xl text-center text-green-400 mb-4">
                        Search Result
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 搜索结果内容 */}
                        <div>
                            <span className="font-semibold text-sm">Block Number:</span>
                            <p className="text-fuchsia-200 break-words">{searchResult.blockNumber}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Block Hash:</span>
                            <p className="text-fuchsia-200 break-words">{searchResult.blockHash}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Transaction Hash:</span>
                            <p className="text-fuchsia-200 break-words">{searchResult.transactionHash}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">From:</span>
                            <p className="text-green-400 break-words">{searchResult.from}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">To:</span>
                            <p className="text-red-400 break-words">{searchResult.to}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Value (in Ether):</span>
                            <p className="text-yellow-400 break-words">{searchResult.value} ETH</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Gas Price (in Gwei):</span>
                            <p className="text-blue-400 break-words">{searchResult.gasPrice}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Gas Limit:</span>
                            <p className="text-orange-400 break-words">{searchResult.gasLimit}</p>
                        </div>
                    </div>
                </div>
            ))}


            <h1 className="text-xl text-center text-green-400 mb-4">
            </h1>

            {loading ? (
                <p className="text-center text-gray-400">Loading transactions...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="space-y-6">
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 border border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2"
                            >
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
