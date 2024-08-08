"use client"
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {useTheme} from 'next-themes'
import {Loading} from "@/app/components/Loading";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import {RiEthFill} from "react-icons/ri";
import {CiSaveDown1} from "react-icons/ci";

export default function BtnConnectSwitch() {
    // dispatch用于触发操作或更新状态，通过调用useMetamask()钩子返回：dispatch函数、和state对象
    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();
    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected = status !== "pageNotLoaded" && typeof wallet === "string";

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

    const handleDownMetamask = () => {

        // 当按钮被点击时，将会打开一个新的浏览器窗口或标签页，地址为谷歌的主页。
        // window.open() 方法的第一个参数是要打开的链接地址，第二个参数是窗口的名称或标识符
        window.open('https://metamask.io/', '_blank');
    };

    let myButton;

    if (status === 'loading') {
        myButton = <Button variant="light" isLoading={true} isIconOnly={true} />;

    } else if (MetamaskInstall) {

        myButton = <Button variant="light" onClick={handleConnect} isIconOnly={true}>
            <RiEthFill style={{color: 'gray'}}/>
        </Button>

    } else if (MetamaskInstallAndConnected) {

        myButton = <Button variant="light" onClick={handleDisconnect} isIconOnly={true}>
            <RiEthFill style={{color: 'forestgreen'}}/>
        </Button>
    } else if (MetamaskNotInstall) {
        myButton = <Button variant="light" onClick={handleDownMetamask} isIconOnly={true}>
            <CiSaveDown1 style={{color: 'gray'}}/>
        </Button>
    }


    return (
        <div>
            {myButton}
        </div>


    );
}
