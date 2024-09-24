"use client";
import React, { useEffect} from "react";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";


const VideoPlayerPage = () => {

    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
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

    // return (
    //     <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
    //         <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg max-w-4xl w-full text-center">
    //
    //             <video className="w-full rounded-lg shadow-md" controls>
    //                 <source src="/city/SHANGHAI30.mp4" type="video/mp4" />
    //                 Your browser does not support the video tag.
    //             </video>
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
            <div className="grid grid-cols-2 gap-5 max-w-5xl w-full">
                {['/city/SHANGHAI30.mp4',
                    'http://skaomdeyb.hb-bkt.clouddn.com/SHANGHAI.mp4?e=1727148227&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:8ACMxx2EynsRCa--Vk6aI9yj1jc=',
                    'http://skaomdeyb.hb-bkt.clouddn.com/NEW%20YORK2.mp4?e=1727148255&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:TFmDWQeQxmbs0SYlmj1-_ZzSX4s=',
                    'http://skaomdeyb.hb-bkt.clouddn.com/NEW%20YORK1.mp4?e=1727148268&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:42GDs_ii_8Zl7o0QnJHljt7QZj8='].map((src, index) => (
                    <div key={index} className="bg-white bg-opacity-90 rounded-lg p-2 shadow-lg w-full text-center">
                        <video className="w-full rounded-lg shadow-md" controls>
                            <source src={src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlayerPage;
