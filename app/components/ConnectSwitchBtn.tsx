"use client"
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import {Loading} from "@/app/components/Loading";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
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
    return (
            showConnectButton && (
                <Button
                    color="primary" variant="flat"
                    onClick={handleConnect}
                    // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent text-base font-medium  sm:w-auto"
                >
                    {status === "loading" ? <Loading/> : "Connect Wallet"}
                </Button>
            )||(
                <Button
                    color="primary" variant="flat"
                    onClick={handleDisconnect}
                    // className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent text-base font-medium  sm:w-auto"
                >
                    {status === "loading" ? <Loading/> : "DisConnect"}
                </Button>
            )



    );
}
