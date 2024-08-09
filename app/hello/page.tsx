"use client"
import USDTMonitor from '@/app/components/monter_BNB_log';
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import React, {useEffect} from "react";
import Link from "next/link";
import {Button, Snippet} from "@nextui-org/react";
import * as config from "@/config";
import {contractUSDTAddress} from "@/config";

const HomePage = () => {
    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();
    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！")

    }, []);

    return (

        <div className="w-full h-full ">
            hello
        </div>
    );
};

export default HomePage;
