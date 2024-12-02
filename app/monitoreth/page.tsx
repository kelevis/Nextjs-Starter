"use client";
import React, {useEffect, useState} from "react";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import Link from "next/link";
import {Button, Input, Snippet, Textarea} from "@nextui-org/react";
import {Progress} from "@nextui-org/react";
import {LuRefreshCw} from "react-icons/lu";
import {MdOutlineNotStarted} from "react-icons/md";
import {FaRegCirclePause} from "react-icons/fa6";
import {CiSearch} from "react-icons/ci";
import { useTheme } from 'next-themes';

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

const EthTransactionMonitor = () => {
    // const {dispatch, state: {status, isMetamaskInstalled, wallet},} = useMetamask();
    const {dispatch} = useMetamask();
    const listen = useListen();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchHash, setSearchHash] = useState<string>(""); // 输入的交易哈希
    const [searchResult, setSearchResult] = useState<Transaction | null>(null); // 搜索结果
    const [progress, setProgress] = useState<number>(0); // 初始为 1，表示 100% 进度
    const [isPaused, setIsPaused] = useState(false); // 控制是否暂停
    const { theme } = useTheme(); // 获取当前主题
    const iconColor = theme ==='dark'? 'text-[#F4F4F4]':theme === 'purple-dark'? 'text-[#F9B6E8]' : 'text-black';
    const [isRefresh, setIsRefresh] = useState(false); // 控制是否旋转
    const fetchTransactions = async () => {
        try {
            setError(null);
            const response = await fetch("api/monitor-eth-transactions", {
                cache: "no-store",
            });
            if (response.status == 200) {
                const data = await response.json();
                setTransactions(data.transactions || []);
                setLoading(false);
            } else {
                console.error(`Failed to Load Transactions... Code: ${response.status}`);
                setError("Failed to Load Transactions...");
                setLoading(false);
            }

        } catch (error) {
            setError("Failed to fetch monitor transactions. Please try again.");
            console.error("api 请求失败. error is:", error);
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchHash.trim()) return;

        try {
            setSearchLoading(true);
            const response = await fetch(`/api/search-transaction?hash=${encodeURIComponent(searchHash)}`);
            const data = await response.json();

            // if (response.ok) {
            if (response.status == 200) {
                setSearchResult(data);
            } else {
                setSearchResult(null);
                console.error(`Error Try again! Code: ${response.status}`);
                alert(`Error Try again`);
            }
        } catch (error) {
            setSearchResult(null);
            console.error("api 请求失败:", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleRefreshClick = () => {
        setIsRefresh(true); // 启动旋转

        fetchTransactions()
            .then(() => setProgress(0),) // 重置进度条
            .then(()=>setIsRefresh(false)) // 请求完成后停止旋转)
            .catch((error) => {
                console.error("Failed to fetch transactions:", error);
                setProgress(0); // 出错时也重置
            })

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
            const {wallet, balance} = local
                ? JSON.parse(local)
                : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！");
    }, []);

    useEffect(() => {
        const interval = 1000; // 每次更新的间隔（毫秒）
        const step = 10; // 每次增加的进度值

        // 定义定时器逻辑
        const timer = setInterval(() => {
            if (isPaused) return; // 如果暂停，则直接返回，不更新进度

            setProgress((prev) => {
                if (prev >= 100) {
                    // 当进度达到 100 时，调用 fetchTransactions
                    fetchTransactions()
                        .then(() => setProgress(0)) // 重置进度条
                        .catch((error) => {
                            console.error("Failed to fetch transactions:", error);
                            setProgress(0); // 出错时也重置
                        });
                    return prev; // 暂停进度增长
                }
                return Math.min(100, prev + step); // 确保进度不会超过 100
            });
        }, interval);

        return () => clearInterval(timer); // 组件卸载时清除定时器
    }, [isPaused]); // 当 isPaused  变化时重新运行

    return (
        <div className="min-h-screen bg-900 p-6">
            <Link href="https://etherscan.io">
                <h1 className="text-4xl text-fuchsia-400 font-bold mb-6 text-center">
                    Ethereum Transaction Monitor
                </h1>
            </Link>

            {/* 搜索交易 */}
            <div className="mb-6 flex items-center relative">
                <Input
                    type="text"
                    placeholder="Enter transaction hash"
                    variant="bordered"
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                    className="p-3 rounded-md pr-12" // 加入右侧内边距给按钮留出空间
                />
                <Button
                    onClick={handleSearch}
                    variant="flat"
                    className="capitalize absolute right-0 top-1/2 transform -translate-y-1/2"
                    isIconOnly={true}
                >
                    <CiSearch size={24}  className={iconColor}/>
                </Button>
            </div>

            {
                searchLoading ? (
                    // <p className="text-center text-gray-400">Loading search transactions...</p>
                    <div className="bg-gray-700 border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2 h-80">
                        <h2 className="text-xl text-center text-green-400 mb-4">
                            Loading...
                        </h2>

                    </div>

                ) : (searchResult && (
                    <div className="bg-gray-700 border-fuchsia-600 p-4 rounded-lg shadow-lg space-y-2">
                        <h2 className="text-xl text-center text-green-400 mb-4">
                            Search Result
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
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

            <div className="mt-6 mb-3 flex items-center gap-6">
                {/*<div className="mt-6 mb-3 flex gap-6 ">*/}

                <Progress
                    size="sm"
                    aria-label="Loading..."
                    value={progress}
                    // showValueLabel={true}
                    label="Loading..."
                />

                <Button
                    onClick={() => setIsPaused((prev) => !prev)}
                    // variant="light"
                    variant="flat"
                    className="capitalize"
                    isIconOnly={true}
                >
                    {isPaused ? <MdOutlineNotStarted size={30} className={iconColor}/> : <FaRegCirclePause size={24} className={iconColor}/>}
                </Button>

                <Button
                    onClick={handleRefreshClick}
                    // variant="light"
                    variant="flat"
                    className="capitalize"
                    isIconOnly
                    isLoading={isRefresh} // 控制加载状态
                >
                    <LuRefreshCw size={24} className={iconColor}/>
                </Button>
            </div>

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                                    <div>
                                        <span className="font-semibold text-sm">Block Number:</span>
                                        <p className="text-fuchsia-200 break-words">{transaction.blockNumber} </p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Block Hash:</span>
                                        <p className="text-fuchsia-200 break-words  line-clamp-3">
                                            <Snippet
                                                symbol=""
                                                style={{
                                                    all: 'unset',
                                                    // display: 'inline-flex', // 保证文本和图标在同一行
                                                    // alignItems: 'center', // 垂直居中对齐文本和图标
                                                    // width: '100%', // 使 Snippet 宽度自动填充父容器
                                                    // wordBreak: 'break-word', // 强制长单词换行
                                                    // overflowWrap: 'break-word', // 防止单词溢出
                                                    // whiteSpace: 'normal' // 允许换行
                                                }}
                                            >
                                                {transaction.blockHash}
                                            </Snippet>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm">Transaction Hash:</span>
                                        <p className="text-fuchsia-200 break-words line-clamp-3">
                                            <Snippet
                                                symbol=""
                                                style={{
                                                    all: 'unset',
                                                }}
                                            >
                                                {transaction.transactionHash}
                                            </Snippet>
                                        </p>
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
