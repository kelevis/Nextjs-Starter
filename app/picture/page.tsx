"use client";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import React, {useEffect, useState} from 'react';
// import Image from 'next/image';
// import { Loading } from '../components/Loading'; // Adjust the import path accordingly


const HomePage = () => {

    const {dispatch,} = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {

            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");
            console.log("local:", local)
            console.log("window:", window)

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
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
            <div className="bg-white bg-opacity-90 rounded-lg p-2 shadow-lg max-w-4xl w-full text-center">

                {/* 使用普通的 img 标签 */}
                {/*<img src="/picture/pic2.png" alt="Sample Picture" className="rounded-lg" />*/}
                <img src="/picture/pic.png" alt="Sample Picture" className="rounded-lg" />

            </div>
        </div>
    );
};



export default HomePage;
