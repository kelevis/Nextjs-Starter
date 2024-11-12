"use client"
import Wallet from '@/app/components/Wallet';
import Recaptcha from '@/app/components/Recaptcha';
import {useListen} from '@/app/hooks/useListen';
import {useMetamask} from '@/app/hooks/useMetamask';
import {useEffect, useState} from 'react';

const Home = () => {
    const {dispatch} = useMetamask();
    const listen = useListen();
    const [error, setError] = useState<string | null>(null); // 用来存储错误消息

    useEffect(() => {

        if (typeof window !== 'undefined') {
            const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem('metamaskState');

            if (local) {
                listen();
            }
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: 'pageLoaded', isMetamaskInstalled, wallet, balance});
        }

    },);

    return (
        <>
            <Wallet/>
        </>
    );
};

export default Home;
