import { NextResponse } from "next/server";
import { ethers } from "ethers";
import * as config from "config.js"

// 替换为您的 JSON-RPC 提供者 URL
const provider = new ethers.JsonRpcProvider(config.alchemy_Endpoints_Url_ethereum_mainNet);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("hash"); // 获取前端传递的交易哈希

    if (!hash) {
        return NextResponse.json({ error: "Transaction hash is required" }, { status: 400 });
    }

    try {
        // 查询交易详情
        const tx = await provider.getTransaction(hash);

        if (!tx) {
            return NextResponse.json({ error: "Transaction not found or pending" }, { status: 404 });
        }

        return NextResponse.json({
            blockNumber: tx.blockNumber?.toString() || "Pending",
            blockHash: tx.blockHash || "N/A",
            transactionHash: tx.hash,
            from: tx.from,
            to: tx.to || "Contract Creation",
            value: ethers.formatEther(tx.value),
            gasPrice: ethers.formatUnits(tx.gasPrice, "gwei"),
            gasLimit: tx.gasLimit.toString(),
        });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return NextResponse.json({ error: "Failed to fetch transaction" }, { status: 500 });
    }
}
