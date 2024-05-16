"use client"
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {useState, useEffect} from 'react'
import {useTheme} from 'next-themes'
import {Loading} from "@/app/components/Loading";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import {RiEthFill} from "react-icons/ri";

export default function ConnectSwitchBtn() {


    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();
    const showInstallMetamask = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const showConnectButton = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";
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

    let myButton;

    if (status === 'loading') {
        myButton = <Button isLoading={true} isIconOnly={true}/>;

    } else if (showConnectButton) {

        myButton = <Button variant="bordered" onClick={handleConnect} isIconOnly={true}>
            <RiEthFill style={{color: 'gray'}}/>
        </Button>

    } else if (!showConnectButton) {

        myButton = <Button variant="bordered" onClick={handleDisconnect} isIconOnly={true}>
            <RiEthFill style={{color: 'forestgreen'}}/>
        </Button>
    }


    return (
        <div>
            {myButton}
        </div>


    );
}
