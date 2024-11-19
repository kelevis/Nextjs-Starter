export const dynamic = 'force-dynamic';
import * as config from "config.js";
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// 连接到 Ethereum 主网，增加超时设置
// 连接到 Ethereum 主网
const provider = new ethers.JsonRpcProvider(config.alchemy_Endpoints_Url_ethereum_mainNet);

export async function GET(request) {
    const token = request.cookies.get('token'); // 获取请求中的 token

    try {
        // 获取最新区块号
        const latestBlock = await provider.getBlockNumber();
        console.log("Latest Block Number:", latestBlock);

        // 获取该区块的详细信息，包括所有交易
        const block = await provider.getBlock(latestBlock, true); // true 表示获取所有交易信息
        console.log('Block:', block);
        console.log('Transactions:', block.transactions);

        // 如果没有交易数据，返回空
        if (!block.transactions || block.transactions.length === 0) {
            return NextResponse.json({ message: 'No transactions found in the latest block' });
        }

        // 获取每个交易的详细信息，带重试机制
        const transactions = await Promise.all(block.transactions.slice(0, 20).map(async (txHash) => {
            const tx = await provider.getTransaction(txHash);
            return {
                blockNumber: tx.blockNumber ? tx.blockNumber.toString() : 'N/A',
                blockHash: tx.blockHash ? tx.blockHash.toString() : 'N/A',
                transactionHash: tx.hash,
                from: tx.from,
                to: tx.to,
                value: ethers.formatEther(tx.value), // 格式化 value
                gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : 'N/A', // 格式化 gasPrice
                gasLimit: tx.gasLimit ? tx.gasLimit.toString() : 'N/A', // 将 gasLimit 转为字符串
            };
        }));

        // 设置响应头，禁用缓存优化
        const response = NextResponse.json({ transactions });
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        return response;

    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Unable to fetch data', details: error.message });
    }
}
