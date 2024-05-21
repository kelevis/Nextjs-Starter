"use client"
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {useState, useEffect} from 'react'
import {useTheme} from 'next-themes'
import {Loading} from "@/app/components/Loading";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import {RiEthFill} from "react-icons/ri";
import { CiSaveDown1 } from "react-icons/ci";

export default function ConnectSwitchBtn() {


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

    let myButton;

    if (status === 'loading') {
        myButton = <Button isLoading={true} isIconOnly={true}/>;

    } else if (MetamaskInstall) {

        myButton = <Button variant="bordered" onClick={handleConnect} isIconOnly={true}>
            <RiEthFill style={{color: 'gray'}}/>
        </Button>

    } else if (MetamaskInstallAndConnected) {

        myButton = <Button variant="bordered" onClick={handleDisconnect} isIconOnly={true}>
            <RiEthFill style={{color: 'forestgreen'}}/>
        </Button>
    }else if (MetamaskNotInstall) {
        myButton = <Button variant="bordered" onClick={handleDisconnect} isIconOnly={true}>
            <CiSaveDown1 style={{color: 'gray'}}/>
        </Button>
    }


    return (
        <div>
            {myButton}
        </div>


    );
}
