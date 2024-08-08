import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const contractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)"
];

const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/3BTT655Z0kgn8kQb4b7Sqo9CvhvbUf7Q");
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

export async function GET(request) {
    const latestBlock = await provider.getBlockNumber();
    const logs = await contractUSDT.queryFilter('Transfer', latestBlock, latestBlock);

    const transfers = logs.map(log => ({
        blockNumber: log.blockNumber.toString(),
        blockHash: log.blockHash.toString(),
        transactionHash: log.transactionHash.toString(),
        from: log.args.from.toString(),
        to: log.args.to.toString(),
        value: log.args.value.toString()
    }));


// get 请求默认处理为静态资源，所以需要添加request.token动态数据
// 这是因为 cookies、headers 这种数据，只能在每次具体请求的时候才能知道，所以 Next.js 会按照正常的 API 进行处理。
// 当你添加其他的 HTTP 方法比如 POST 方法的时候也会将其转为动态处理：
    const token = request.cookies.get('token')   //
    return NextResponse.json({ transfers });

    // const response = NextResponse.json({ transfers });
    // response.headers.set('Cache-Control', 'no-store, max-age=0');
    // return response;

}
