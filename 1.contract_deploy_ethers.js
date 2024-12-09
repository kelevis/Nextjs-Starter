import { ethers } from 'ethers';
import fs from 'fs';
import * as config from './config.js';

async function deployContract() {
    // 初始化 ethers.js 提供者
    const provider = new ethers.JsonRpcProvider("http://172.32.150.61:8546");

    // 使用现有账户或创建一个新账户
    const wallet = new ethers.Wallet(config.besuPrivateKey2, provider);

    // 读取合约的 ABI 和二进制数据
    const contractJson = JSON.parse(fs.readFileSync("SimpleStorage.json"));
    const contractAbi = contractJson.abi;
    const contractBin = fs.readFileSync("SimpleStorage.bin").toString();

    // 初始化合约工厂
    const contractFactory = new ethers.ContractFactory(contractAbi, contractBin, wallet);

    console.log('部署合约...');
    try {
        // 部署合约
        const contract = await contractFactory.deploy(47); // 传入构造函数的参数

        console.log('等待交易确认...');
        await contract.deploymentTransaction().wait(); // 等待部署交易完成

        console.log('合约部署成功');
        console.log('合约地址:', contract.target); // 使用 `target` 获取合约地址
    } catch (err) {
        console.error('Transaction failed:', err);
    }
}

// 调用异步函数
deployContract().catch(console.error);

//合约地址： 0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF