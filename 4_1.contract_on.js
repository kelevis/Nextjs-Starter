// var proxy = {
//     host: "127.0.0.1", //代理服务器地址
//     port: 7890,//端口
//     // auth: { // auth认证信息，阿布云那边有，squid 的话不需要
//     //     username: '',password: ''
//     // }
// };
// // https://github.com/axios/axios#request-config
// axios.get(configJs.googleUrl, {proxy: proxy})
//     .then((response) => console.log(response.data))
//     .catch((error) => console.log(error))

// 使用axios
// axios.get(configJs.baiduUrl, { httpsAgent: agent })
//     .then(response => console.log(response.data))
//     .catch(error => console.error(error));

// request.get(options, function(err, response, body) {
//     console.info(response);
//     console.log("get is ok");
//     console.log("error:",err);
//
// })

// const Http = new XMLHttpRequest();
// Http.open("GET", configJs.coinMarketCapApiUSDtUrl);
// Http.send();
//
// Http.onreadystatechange = (e) => {
//     console.log(Http.responseText)
// }

// // // 发送 API 请求
// fetch(configJs.coinMarketCapApiUSDtUrl,  )
//     .then(response =>
//     {
//         // 检查响应是否成功
//         if (!response.ok) {
//             throw new Error('网络请求失败');
//         }
//         console.log("response:",response.status)
//         return response.json()   // 将响应转换为json格式
//
//     })
//
//     .then(data => {
//         // 解析响应数据
//         const ethData = data.data;
//         console.log(`当前以太坊兑换美元的汇率：${ethData}`);
//     })
//     .catch(error => console.error('API 请求出错：', error));

// var options = {
//     url:configJs.coinMarketCapApiUSDtUrl,
//     method: 'GET',
//     headers: {
//         'Authorization': 'Bearer YourAccessToken',
//         'Content-Type': 'application/json'
//     }
// };

import {ethers} from "ethers";
import * as configJs from './config.js';

// import request from 'request'

const contractAddress = configJs.contractUSDTAddress;
const abi = configJs.abiTransfer;

// 设置provider，连接主网；填上你的Alchemy APIKey
const provider = new ethers.JsonRpcProvider(configJs.alchemy_Endpoints_Url_ethereum_mainNet)

// 生成USDT合约对象
const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

// 持续监听USDT合约
console.log("\n2. 利用contract.on()，持续监听Transfer事件");
contractUSDT.on('Transfer', (from, to, value) => {

    const valueWei = ethers.getBigInt(value);  //默认wei
    const valueGwei = ethers.formatUnits(valueWei,"gwei");  //gwei   ethers.formatUnits 小单位转大单位
    const valueEth = ethers.formatUnits(valueWei,"ether");  //gwei   ethers.formatUnits 小单位转大单位
    const USDTMid = valueWei* 3645n   //先算美元汇率
    const USDTFinal = ethers.formatUnits(USDTMid,"ether");

    console.log("wei:",valueWei)
    console.log("gwei:",valueGwei)
    console.log("eth:",valueEth)
    console.log("USDT:",USDTFinal)

    console.log(
        // 打印结果
        `监控币安USDT合约: from: ${from} -> to: ${to} Value: ${ethers.formatUnits(ethers.getBigInt(value), "ether")} ether, ${ethers.formatUnits(ethers.getBigInt(value), "gwei")} Gwei USDT:`, USDTFinal)

})