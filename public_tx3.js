import Web3 from 'web3';
import { Transaction as Tx } from 'ethereumjs-tx'; // 使用 `ethereumjs-tx` 库
import fs from 'fs';
import path from 'path';
import * as config from './config.js'; // 使用 import 语法导入配置文件

// 创建一个异步函数来处理异步代码
async function deployContract() {
    // 初始化 Web3 实例
    // const web3 = new Web3(config.alchemy_Endpoints_Url_ethereum_sepolia);
    // const web3 = new Web3(config.locall_Endpoints_Url_ethereum_QBFT);
    // const web3 = new Web3("https://rpc5.gemini.axiomesh.io");
    const web3 = new Web3("http://172.32.150.61:8546");

    // 使用现有账户或创建一个新账户
    // const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
    const privateKey = "0x"+config.besuPrivateKey2;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // 读取合约的 ABI 和二进制数据
    // const contractJsonPath = path.resolve('SimpleStorage.json');
    // const contractBinPath = path.resolve('SimpleStorage.bin');

    const contractJson = JSON.parse(fs.readFileSync("SimpleStorage.json"));
    const contractAbi = contractJson.abi;
    const contractBin = fs.readFileSync("SimpleStorage.bin");

    // 初始化合约构造函数的值
    const contractConstructorInit = '000000000000000000000000000000000000000000000000000000000000002F';
    // const contractConstructorInit = web3.utils.toHex(47); // 用十进制整数初始化


    // 获取交易的 nonce 值
    const txnCount = await web3.eth.getTransactionCount(account.address);

    // 获取当前的 gas 价格
    const gasPrice = await web3.eth.getGasPrice();

    // 设置交易选项
    const rawTxOptions = {
        nonce: web3.utils.numberToHex(txnCount)+1, // 交易的 nonce 值
        from: account.address, // 交易发送者地址
        to: null, // 合约部署，不需要设置收件人地址
        value: '0x00', // 交易金额
        data: '0x' + contractBin.toString('hex') + contractConstructorInit, // 合约二进制数据和初始化值
        maxFeePerGas: web3.utils.numberToHex(Math.round(parseInt(gasPrice, 16) * 1.2)), // 设置 gas 费用为当前 gas 价格的 120%
        maxPriorityFeePerGas: web3.utils.numberToHex(1000000000), // 设置优先费用为 1 Gwei
        gasLimit: web3.utils.numberToHex(1500000), // 设置 gas 限额
    };
    console.log("交易参数:", rawTxOptions)

    console.log('创建交易...');
    const tx = new Tx(rawTxOptions); // 使用 `ethereumjs-tx` 创建交易实例

    console.log('签名交易...');
    tx.sign(Buffer.from(privateKey.slice(2), 'hex')); // 使用私钥签名交易

    console.log('发送交易...');
    const serializedTx = tx.serialize();


    try {
        const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
        console.log('交易 Hash: ' + pTx.transactionHash);
        console.log('合约地址: ' + pTx.contractAddress);
    } catch (err) {
        console.error('Transaction failed:', err);
        if (err.receipt) {
            console.error('Transaction receipt:', err.receipt);
        }
    }

}


// 调用异步函数
deployContract().catch(console.error);