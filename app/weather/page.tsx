"use client";
import { useMetamask } from "@/app/hooks/useMetamask";
import { useListen } from "@/app/hooks/useListen";
import React, { useEffect } from "react";
import WeatherMonitor from "@/app/components/monter_weather";

const HomePage = () => {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet, balance },
    } = useMetamask();
    const listen = useListen();
    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall =
        status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected =
        status !== "pageNotLoaded" && typeof wallet === "string";

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled =
                ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const { wallet, balance } = local
                ? JSON.parse(local)
                : { wallet: null, balance: null };
            dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
        }
    }, []);

    return (
        <div className="w-full h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to Weather Forecast</h1>
            <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800 w-full md:w-3/4 lg:w-1/2">
                <WeatherMonitor />
            </div>
        </div>
    );
};

export default HomePage;
