import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// 连接到 Ethereum 主网（Alchemy 或其他节点服务）
const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/3BTT655Z0kgn8kQb4b7Sqo9CvhvbUf7Q");

let transactions = [];

// 获取最新区块中的所有交易
async function fetchLatestBlockTransactions() {
    try {
        // 获取最新区块的区块号
        const latestBlockNumber = await provider.getBlockNumber();

        // 获取该区块的详细信息，包括交易信息
        const block = await provider.getBlock(latestBlockNumber, true); // true 表示获取交易信息

        if (!block.transactions || block.transactions.length === 0) {
            console.log(`No transactions found in block #${latestBlockNumber}`);
            return; // 如果区块没有交易，直接返回
        }

        // 过滤出以太币转账交易（即 'value' 字段大于 0）
        const blockTransactions = block.transactions.filter(tx => ethers.BigNumber.from(tx.value).gt(0))
            .map(tx => ({
                blockNumber: tx.blockNumber || 'N/A',
                blockHash: tx.blockHash || 'N/A',
                transactionHash: tx.hash || 'N/A',
                from: tx.from || 'N/A',
                to: tx.to || 'N/A',
                value: tx.value, // 将以太币转换为以太
                gasPrice: tx.gasPrice, // 将 Gas Price 转换为 Gwei
                gasLimit: tx.gasLimit, // Gas Limit
            }));

        // 将最新的交易添加到数组中（保留最多 10 笔交易）
        transactions.unshift(...blockTransactions);
        if (transactions.length > 10) {
            transactions.pop(); // 保留最新的 10 笔交易
        }
    } catch (error) {
        console.error("Error fetching latest block transactions:", error);
    }
}

// 每 15 秒更新一次最新的区块交易
setInterval(fetchLatestBlockTransactions, 15000);

// 处理 GET 请求，返回最新的交易
export async function GET(request) {
    const token = request.cookies.get('token'); // 从请求中获取 token（如果需要）

    // 返回最新的 10 笔以太币转账交易
    return NextResponse.json({ transactions });
}
