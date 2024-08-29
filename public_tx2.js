import Web3 from 'web3';
import { Transaction as Tx } from 'ethereumjs-tx'; // 使用 `ethereumjs-tx` 库
import fs from 'fs';
import path from 'path';
import * as config from './config.js'; // 使用 import 语法导入配置文件

// 创建一个异步函数来处理异步代码
async function deployContract() {
    // 初始化 Web3 实例
    const web3 = new Web3(config.alchemy_Endpoints_Url_ethereum_sepolia);
    // const web3 = new Web3(config.locall_Endpoints_Url_ethereum_QBFT);
    // const web3 = new Web3("https://rpc5.gemini.axiomesh.io");

    // 使用现有账户或创建一个新账户
    // const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
    const privateKey = "0x"+config.myAccountPrivateKey;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // 读取合约的 ABI 和二进制数据
    const contractJsonPath = path.resolve('SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractBinPath = path.resolve('SimpleStorage.bin');
    const contractBin = fs.readFileSync(contractBinPath);

    // 初始化合约构造函数的值
    const contractConstructorInit = '000000000000000000000000000000000000000000000000000000000000002F';

    // 获取交易的 nonce 值
    const txnCount = await web3.eth.getTransactionCount(account.address);

    // 获取当前的 gas 价格
    const gasPrice = await web3.eth.getGasPrice();

    // 设置交易选项
    // const rawTxOptions = {
    //     nonce: web3.utils.numberToHex(txnCount), // 交易的 nonce 值
    //     from: account.address, // 交易发送者地址
    //     to: null, // 合约部署，不需要设置收件人地址
    //     value: '0x00', // 交易金额
    //     data: '0x' + contractBin.toString('hex') + contractConstructorInit, // 合约二进制数据和初始化值
    //     maxFeePerGas: web3.utils.numberToHex(Math.round(parseInt(gasPrice, 16) * 1.2)), // 设置 gas 费用为当前 gas 价格的 120%
    //     maxPriorityFeePerGas: web3.utils.numberToHex(1000000000), // 设置优先费用为 1 Gwei
    //     gasLimit: web3.utils.numberToHex(1500000), // 设置 gas 限额
    // };


    // const rawTxOptions = {
    //     nonce: web3.utils.numberToHex(txnCount),
    //     from: account.address,
    //     to: null,
    //     value: '0x00',
    //     data: '0x' + contractBin.toString('hex') + contractConstructorInit,
    //     maxFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
    //     maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
    //     gasLimit: web3.utils.numberToHex(3000000), // Increase gas limit
    // };

    const rawTxOptions = {
        nonce: web3.utils.numberToHex(txnCount),
        from: account.address,
        to: null,
        value: '0x00',
        data: '0x' + contractBin.toString('hex') + contractConstructorInit,
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei('1', 'gwei')), // 更低的 maxFeePerGas
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('1', 'gwei')), // 更低的 maxPriorityFeePerGas
        gasLimit: web3.utils.numberToHex(1000000), // 更低的 gasLimit
    };



    console.log('创建交易...');
    const tx = new Tx(rawTxOptions); // 使用 `ethereumjs-tx` 创建交易实例

    console.log('签名交易...');
    tx.sign(Buffer.from(privateKey.slice(2), 'hex')); // 使用私钥签名交易

    console.log('发送交易...');
    // const serializedTx = tx.serialize(); // 序列化交易
    // const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')); // 发送已签名的交易

    try {
        const result = await web3.eth.call(rawTxOptions);
        console.log(result);
    } catch (err) {
        console.error('Transaction simulation failed:', err);
    }


    console.log('交易 Hash: ' + pTx.transactionHash);
    console.log('合约地址: ' + pTx.contractAddress);
}

// 调用异步函数
deployContract().catch(console.error);
