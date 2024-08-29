import {ethers} from 'ethers';
import fs from 'fs';
import * as config from './config.js';

async function deployContract() {
    // 初始化 ethers.js 提供者
    // const provider = new ethers.providers.JsonRpcProvider(config.alchemy_Endpoints_Url_ethereum_sepolia);
    // const provider = new ethers.providers.JsonRpcProvider(config.locall_Endpoints_Url_ethereum_QBFT);
    // const provider = new ethers.providers.JsonRpcProvider("https://rpc5.gemini.axiomesh.io");
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
        const contract = await contractFactory.deploy(47); // 传入构造函数的参数
        await contract.deployed();
        console.log('合约部署成功');
        console.log('合约地址:', contract.address);
    } catch (err) {
        console.error('Transaction failed:', err);
    }
}

// 调用异步函数
deployContract().catch(console.error);
