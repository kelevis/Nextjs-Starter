// app/api/transfers/route.js
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)"
];

const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/3BTT655Z0kgn8kQb4b7Sqo9CvhvbUf7Q");
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

interface Transfer {
    from: string;
    to: string;
    value: string;
}

let latestTransfers: Transfer[] = [];

contractUSDT.on('Transfer', (from, to, value) => {
    console.log(`监控币安USDT合约: from: ${from} -> to: ${to} Value: ${value.toString()} ether`);
    // 接着往下写
    // 将转账信息添加到最新转账信息数组的开头
    latestTransfers.unshift({
        from: from.toString(),
        to: to.toString(),
        value: value.toString()
    });

    console.log("latestTransfers:",latestTransfers)
    if (latestTransfers.length > 5) latestTransfers.pop();  // Keep only the latest 5 transfers，排出末尾数据
});

export async function GET() {
    try {
        return NextResponse.json(latestTransfers);

    } catch (error) {
        console.error('Error fetching transfers:', error);
        // res.status(500)
        return NextResponse.json({ error: 'Error fetching transfers' }, { status: 500 });
    }

}
