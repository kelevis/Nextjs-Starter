import Web3 from 'web3';
import { Transaction as Tx } from 'ethereumjs-tx'; // Use `ethereumjs-tx` package
import fs from 'fs';
import path from 'path';
import * as config from './config.js'; // Use import syntax

// Create an async function to handle the asynchronous code
async function deployContract() {
    // Initialize Web3
    // const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Update with your Infura project ID
    const web3 = new Web3(config.alchemy_Endpoints_Url_ethereum_sepolia); // Update with your Infura project ID


    // Use an existing account or create a new one
    const privateKey = '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    // Read the contract ABI and binary
    const contractJsonPath = path.resolve('SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const contractBinPath = path.resolve('SimpleStorage.bin');
    const contractBin = fs.readFileSync(contractBinPath);

    // Initialize the constructor with a value
    const contractConstructorInit = '000000000000000000000000000000000000000000000000000000000000002F';

    // Get transaction count for the nonce value
    const txnCount = await web3.eth.getTransactionCount(account.address);

    // Set transaction options
    const rawTxOptions = {
        nonce: web3.utils.numberToHex(txnCount),
        from: account.address,
        to: null, // Contract deployment
        value: '0x00',
        data: '0x' + contractBin.toString('hex') + contractConstructorInit, // Contract binary with initialization value
        gasPrice: web3.utils.numberToHex(20000000000), // Gas price in wei
        gasLimit: web3.utils.numberToHex(1500000), // Gas limit
    };

    console.log('Creating transaction...');
    const tx = new Tx(rawTxOptions, { chain: 'mainnet' }); // Specify chain if needed

    console.log('Signing transaction...');
    tx.sign(Buffer.from(privateKey.slice(2), 'hex'));

    console.log('Sending transaction...');
    const serializedTx = tx.serialize();
    const pTx = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

    console.log('Transaction Hash: ' + pTx.transactionHash);
    console.log('Contract Address: ' + pTx.contractAddress);
}

// Call the async function
deployContract().catch(console.error);
