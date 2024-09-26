import Link from "next/link";
import {useListen} from "@/app/hooks/useListen";
import {useMetamask} from "@/app/hooks/useMetamask";
import {Loading} from "./Loading";
import {ethers} from "ethers";
import * as config from "@/config.js"
import React, {useState} from 'react';
import {FaCopy} from 'react-icons/fa';
import {Button, Input, Textarea} from "@nextui-org/react";
import {Snippet} from "@nextui-org/react";
import TimeAndLogo from "@/app/components/uiTimeAndLogo"
import CalenderBtn from "@/app/components/uiCalender";
import DashboardClock from "@/app/components/Time"

// import TimeClockViews from "@/app/components/Time";
// import { useTheme } from '@mui/system';
// import { FormControl, useFormControlContext } from '@mui/base/FormControl';


export default function Wallet() {

    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();
    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    // const [error, setError] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const [signature, setSignature] = useState<string | null>(null);
    const [inputAddress, setInputAddress] = useState<string>('');
    const [inputTokenId, setInputTokenId] = useState<string>('');

    const [inputTokenIdSign, setInputTokenIdSign] = useState<string>('');
    const [inputSignature, setInputSignature] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const [invokeLoading, setInvokeLoading] = useState(false);
    const [sgnLoading, setSgnLoading] = useState(false);

    const getSignature = async (account: string, tokenId: bigint): Promise<string> => {

        // const wallet = ethers.Wallet.fromPhrase(config.myMnemonic6)

        // const wallet = new ethers.Wallet(config.demoContractSepoliaPrivateKey)
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        // 获取当前钱包账户
        const signer = await browserProvider.getSigner()

        // const providerSepolia= new ethers.JsonRpcProvider(config.alchemy_Endpoints_Url_ethereum_sepolia)
        // const wallet = new ethers.Wallet(config.mylinkContractSepoliaPrivateKey, providerSepolia)

        // 创建消息  生成签名
        // const account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
        // const tokenId = "0"
        // 等效于Solidity中的keccak256(abi.encodePacked(account, tokenId))
        const msgHash = ethers.solidityPackedKeccak256(['address', 'uint256'], [account, tokenId])
        console.log(`msgHash：${msgHash}`)

        // 签名
        const messageHashBytes = ethers.getBytes(msgHash)
        const signature = signer.signMessage(messageHashBytes);
        console.log(`链下签名（相当于领货码）：${signature}`)

        return await signature
    };

    const handleAddUsdc = async () => {
        dispatch({type: "loading"});

        await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                    symbol: "USDC",
                    decimals: 18,
                    image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
                },
            },
        });
        dispatch({type: "idle"});
    };

    const handleConnect = async () => {
        dispatch({type: "loading"});
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
            console.log("已连接到 MetaMask");

            const balance = await window.ethereum!.request({
                method: "eth_getBalance",
                params: [accounts[0], "latest"],
            });
            dispatch({type: "connect", wallet: accounts[0], balance});

            // we can register an event listener for changes to the users wallet
            listen();
        }
    };

    const handleDisconnect = () => {
        dispatch({type: "disconnect"});
    };

    const handleInputAddressChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {

        try {
            setInputAddress(event.target.value); // 更新文本输入框的值

        } catch (error) {


            return {message: "setInputAddress error"}

        }

    };

    const handleInputTokenIdChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputTokenId(event.target.value); // 更新文本输入框的值
    };

    const handleInputTokenIdSignChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputTokenIdSign(event.target.value); // 更新文本输入框的值
    };

    const handleInputSignatureChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {

        try {
            setInputSignature(event.target.value); // 更新文本输入框的值

        } catch (error) {


            return {message: "setInputAddress error"}

        }

    };

    const handleGetSignature = async () => {
        setSgnLoading(true)

        try {
            const signatureResult = await getSignature(inputAddress, BigInt(inputTokenId)); // 调用 getSignature 函数，并传递文本输入框的值
            setSignature(signatureResult); // 更新签名结果
            setError(null); // 清除之前的错误状态
        } catch (error) {
            console.error('Error getting signature:', error);
            alert("Error Try again")
            // setError(error.message); // 设置错误状态为捕获到的错误信息

        }

        setSgnLoading(false)
    };

    const handleContractWrite = async () => {

        setInvokeLoading(true);

        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        // 获取当前钱包账户
        const signer = await browserProvider.getSigner()
        const account = await signer.getAddress();

        const balance = await browserProvider.getBalance(account);
        const contract = new ethers.Contract(config.demoContractSepoliaSignNFT, config.abiDemoContractSepoliaSignNFT, signer);

        console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)

        try {
            console.log("safeMint inputTokenIdSign:", BigInt(inputTokenIdSign))
            console.log("safeMint tokenUrlImageJson ", config.tokenUrlImageJson)
            console.log("safeMint  signature", signature)

            const tx = await contract.safeMint(BigInt(inputTokenIdSign), config.tokenUrlImageJson, inputSignature)

            console.log("result tx:", tx.toString());

        } catch (error) {
            console.error("Error:", error);
            alert("Error Try again")
            //
            // if (error instanceof Error) { // 确保 error 是 Error 类型
            //
            //     alert("Try again"); // 在警告框中显示错误消息
            //     console.error("Error:", error);
            //     // setError(error.message); // 设置错误状态
            //
            // } else {
            //
            //     alert("Try again"); // 在警告框中显示错误消息
            //     console.error("Error:", error);
            // }
        }

        setInvokeLoading(false);


    };

    const handleContractWriteEth = async () => {

        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        // 读取钱包地址  读取chainid    读取ETH余额
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const account = accounts[0]
        const {chainId} = await browserProvider.getNetwork()

        const signer = await browserProvider.getSigner()
        const balance = await browserProvider.getBalance(signer.getAddress());

        console.log(`钱包地址: ${account}`)
        console.log(`chainid: ${chainId}`)
        console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)

        const contract = new ethers.Contract(config.myContractSepoliaSignNft, config.abiMyContractSepoliaSignNft, signer);

        try {
            // browserProvider.getSigner().then((signer) =>{
            //               await signer.sendTransaction({
            //                   to: "0xCe06B0A53b08C10fa508BF16D02bBdDc6961E3B3",
            //                   value: ethers.parseEther("0.000000001")
            //               });
            // })
            await signer.sendTransaction({
                to: "0xCe06B0A53b08C10fa508BF16D02bBdDc6961E3B3",
                value: ethers.parseEther("0.000000001")
            });

            //签名  信息
            browserProvider.getSigner().then((signer) => {
                signer.signMessage("我需要签名0007")
                console.log("r.address:", signer.address)
            });

            console.log("r.address:", signer.address)
            console.log("signer:", signer)

        } catch (error) {
            console.error("Error:", error);
        }

    };

    const handleContractRead = async () => {
        // 读取钱包地址
        // const accounts = await browserProvider.send("eth_requestAccounts", []);
        // const account = accounts[0]
        // 读取chainid

        // 获取当前钱包账户   读取ETH余额
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner()
        const account = await signer.getAddress();
        const balance = await browserProvider.getBalance(account);
        const {chainId} = await browserProvider.getNetwork()
        const contract = new ethers.Contract(config.myContractSepoliaSignNft, config.abiMyContractSepoliaSignNft, signer);
        console.log(`钱包地址: ${account}`)
        console.log(`chainid: ${chainId}`)
        console.log(`以太坊余额： ${ethers.formatUnits(balance)}`)

        try {
            // 调用合约方法
            const name = await contract.name()
            const maxSupply = await contract.maxSupply()
            console.log("name:", name);
            console.log("maxSupply:", maxSupply);

        } catch (error) {
            console.error("Error:", error);
        }

    };

    const CopyButton: React.FC<{ textToCopy: string }> = ({textToCopy}) => {

        const handleCopy = () => {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    console.log('Text copied to clipboard');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                    alert('Failed to copy wallet address!');
                });
        };

        return (
            <div>
                <button onClick={handleCopy} className={""}>
                    {copied ? 'PrivateKey Copied!' : <FaCopy/>}
                    {/*{copied ? 'Copied!' : 'Copy'}*/}
                </button>
            </div>
        );
    };

    return (
        <div className='w-full h-screen' >
        {/*<div className={`w-full h-screen ${!MetamaskInstallAndConnected ? "bg-gradient-to-r from-purple-500 to-blue-500" : ""}`  }>*/}

            {/*<div className={"dark text-center w-full h-auto sm:py-20 sm:px-6 lg:px-84"}>*/}
            {/*</div>*/}
            {/*<div className="bg-gray-800  mt-0 mb-0 mx-auto  max-w-5xl px-0 py-0 text-center sm:py-20 sm:px-6 lg:px-8">*/}


            <div className="mx-auto px-auto text-center sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center px-0 py-0 mx-0 my-0 tracking-tight  sm:text-4xl">
                    <span>Metamask API Invoke</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-center px-0 py-0 mx-0 my-40">
                    Follow along with the{" "}
                    <Link
                        href="https://github.com/GuiBibeau/web3-unleashed-demo"
                        target="_blank"
                    >
                        <span className="underline cursor-pointer">Repo</span>
                    </Link>{" "}
                    in order to learn how to use the Metamask API.
                </p>


                {MetamaskNotInstall && (

                    <div className={"flex flex-row justify-center gap-4"}>

                        <TimeAndLogo text={"Please install Metamask"}/>

                        {/*<Link*/}
                        {/*    href="https://metamask.io/"*/}
                        {/*    target="_blank"*/}
                        {/*    className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent  px-5 py-3 text-base font-medium  sm:w-auto"*/}
                        {/*>*/}
                        {/*    Install Metamask*/}
                        {/*</Link>*/}


                        {/*<CalenderBtn/>*/}

                    </div>

                )}


                {MetamaskInstall && (

                    <div className={"flex flex-row justify-center items-center"}>
                        <TimeAndLogo text={"Please connect Metamask"}/>

                    </div>

                )}


                {MetamaskInstallAndConnected && (
                    <div className="mx-auto justify-self-center content-center sm:px-6">

                        <h3 className="text-3xl font-medium leading-6 ">
                            Balance:{" "}
                                  <span>
                              {(parseInt(balance as string) / 1000000000000000000).toFixed(4)}{" "}
                                      ETH
                            </span>
                        </h3>

                        <div className={"text-center"}>
                            <p className=" text-1xl">
                                <span>{wallet}</span>
                            </p>

                            {/*<CopyButton textToCopy={wallet}/>*/}

                        </div>

                        <br/>


                        <Link
                            href="https://sepolia.etherscan.io/address/0xa74348Ce54504bC306cF85c6281816C4d3676ed4"
                            target="_blank"
                            className="my-4 text-center"


                        >
                            <Button
                                color="primary" variant="flat"
                            >
                                Sepolia-Contract: {config.demoContractSepoliaSignNFT}

                            </Button>

                        </Link>
                        {/*<CopyButton textToCopy={config.demoContractSepoliaPrivateKey}/>*/}
                        <br/>
                        <Snippet
                            variant="flat"
                            color={"primary"}
                            className={"my-4 mx-4"}
                        >
                            demo-PrivateKey:{config.demoContractSepoliaPrivateKey}</Snippet>

                        <br/>

                    </div>


                )}

                {MetamaskInstallAndConnected && (

                    <form className="flex w-full justify-center space-x-2 my-4 gap-6 text-center">
                        <div className="flex flex-col text-center">
                            {/* 地址输入框 */}
                            {/*<label htmlFor="address-input  " className={""}>地址</label>*/}
                            <Input
                                id="address-input"
                                type="text"
                                value={inputAddress}
                                onChange={handleInputAddressChange}
                                placeholder="address"
                                label="地址"
                                variant="bordered"
                                labelPlacement={"outside"}
                                // className={"text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 dark:text-slate-900 dark:text-slate-300 focus-visible:outline-0"}

                            />

                            {/* tokenId 输入框 */}
                            {/*<label htmlFor="token-id-input" className={""}>tokenId</label>*/}
                            <Input
                                id="token-id-input"
                                type="text"
                                value={inputTokenId}
                                onChange={handleInputTokenIdChange}
                                placeholder="tokenId"
                                label="tokenId"
                                variant="bordered"
                                labelPlacement={"outside"}
                                // className={"text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"}

                            />
                        </div>
                    </form>

                )}

                {MetamaskInstallAndConnected && (

                    sgnLoading ? (
                        <div className="flex  w-full justify-center my-4 space-x-2">
                            <Button
                                color="primary" variant="flat"
                                isLoading={true}
                                // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache  px-5 py-3 text-base font-medium  sm:w-auto"
                            >
                            </Button>

                        </div>
                    ) : (
                        <div className="flex  w-full justify-center space-x-2">
                            <Button
                                color="primary" variant="flat"
                                onClick={handleGetSignature}
                                // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache  px-5 py-3 text-base font-medium  sm:w-auto"
                            >
                                {status === "loading" ? <Loading/> : "Get Signature"}
                            </Button>


                        </div>
                        )





                )}

                {MetamaskInstallAndConnected && (
                    <div className="flex  w-full justify-center my-4 space-x-2">
                        {/* 显示签名结果 */}
                        {signature && (
                            <div className="mt-4">
                                <h2>
                                    <Textarea
                                        // className="p-2 rounded border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                                        // rows={2} // 设置行数为 5，高度适中
                                        // minRows={2}
                                        // minRows={2}
                                        value={signature}
                                        cols={100} // 设置列数为 50，显示为横向长条
                                        maxRows={2}       //最大行数,NextUI
                                        variant="bordered"
                                        placeholder="This is signature"
                                        label="Signature:"
                                        labelPlacement="outside"
                                    />
                                </h2>


                            </div>
                        )}


                    </div>
                )}

                {MetamaskInstallAndConnected && (

                    <form className="flex w-full justify-center space-x-2 my-4 gap-6 text-center">
                        <div className="flex flex-col text-center">
                            {/*<label htmlFor="token-id-input" className={""}>tokenId</label>*/}
                            <Input
                                id="token-id-input"
                                type="text"
                                value={inputTokenIdSign}
                                onChange={handleInputTokenIdSignChange}
                                placeholder="tokenId"
                                label="tokenId"
                                variant="bordered"
                                labelPlacement={"outside"}
                                // className={"text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"}
                            />

                            {/*<label htmlFor="signature-input" className={""}>signature</label>*/}
                            <Input
                                id="signature-input"
                                type="text"
                                value={inputSignature}
                                onChange={handleInputSignatureChange}
                                placeholder="signature"
                                variant="bordered"
                                label="signature"
                                labelPlacement={"outside"}
                                // className={"text-sm font-sans font-normal leading-5 px-3 py-2 rounded-lg shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-300 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-300 focus-visible:outline-0"}

                            />

                        </div>
                    </form>

                )}


                {MetamaskInstallAndConnected && (
               // 只有当 Metamask 安装并连接时才会渲染内容

                    invokeLoading ? (
                        <div className="flex  w-full justify-center my-4 space-x-2">
                            <Button
                                color="primary" variant="flat"
                                isLoading={true}
                                // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache  px-5 py-3 text-base font-medium  sm:w-auto"
                            >
                            </Button>

                        </div>
                    ) : (
                        <div className="flex  w-full justify-center my-4 space-x-2">
                            <Button
                                color="primary" variant="flat"
                                onClick={handleContractWrite}
                                // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-ganache  px-5 py-3 text-base font-medium  sm:w-auto"
                            >
                                {status === "loading" ? <Loading/> : "Invoke Contract"}
                            </Button>

                            {/*{error && <div className="alert alert-danger">{error}</div>} /!* 显示错误提示 *!/*/}

                        </div>
                    )


                )}


            </div>


        </div>

    );
}



