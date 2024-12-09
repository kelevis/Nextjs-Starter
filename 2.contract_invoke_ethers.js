import { ethers } from 'ethers';
import fs from 'fs';
import * as config from './config.js';

async function interactWithContract() {
    // 初始化 ethers.js 提供者
    const provider = new ethers.JsonRpcProvider("http://172.32.150.61:8546");

    // 使用现有账户
    const wallet = new ethers.Wallet(config.besuPrivateKey2, provider);

    // 读取合约的 ABI
    const contractJson = JSON.parse(fs.readFileSync("SimpleStorage.json"));
    const contractAbi = contractJson.abi;

    // 部署时获取的合约地址
    const contractAddress = "0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF";

    // 实例化合约
    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

    try {
        // 获取当前区块高度
        const blockNumber = await provider.getBlockNumber();
        console.log("当前区块高度:", blockNumber);

        const currentValue = await contract.get();
        console.log("当前存储的值:", currentValue);

        console.log("设置新值...");
        const tx = await contract.set(88); // 调用 `set` 方法
        await tx.wait(); // 等待交易完成

        console.log("新值已设置完成, 新值为:", await contract.get());
    } catch (err) {
        console.error("与合约交互时出错:", err);
    }
}

// 调用异步函数
interactWithContract().catch(console.error);
