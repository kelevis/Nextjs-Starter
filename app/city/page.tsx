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

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
            <div className="bg-white bg-opacity-90 rounded-lg p-2 shadow-lg max-w-4xl w-full text-center">

                <video className="w-full rounded-lg shadow-md" controls>
                    <source src="/city/SHANGHAI30.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );

    // return (
    //     // <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
    //     <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r bg-opacity-50 from-purple-500 to-blue-500 p-4">
    //         <div className="grid grid-cols-4 gap-5 max-w-8xl w-full">
    //             {['/city/SHANGHAI30.mp4',
    //                 'https://f.video.weibocdn.com/u0/qLhQN0v6gx087QM1kKR20104125M0UxU0E230.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4935355154235432&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,8143-g0,8013-g0,3601-g29,3601-g39,3601-g19,3601-g36,7598-g0,3601-g27,3601-g37&Expires=1727172175&ssig=G1y%2FxKQOfQ&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/E1ZFyMIagx07UP7R0Rkc0104125c5Yf30E1Q0.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4751832841650190&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=3&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,6377-g0,1192-g0,1191-g0,3601-g39,1258-g0,3601-g19,3601-g36,3601-g36,3601-g27,3601-g27&Expires=1727170200&ssig=vSWEUiNEPN&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/qFwEWg5Lgx0805dbjmfe0104122Nfkj60E100.mp4?label=mp4_1440p&template=2560x1440.25.0&media_id=4825935254585393&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,8143-g0,3601-g29,3601-g36,8013-g0,3601-g36,7598-g0,3601-g27&Expires=1727170563&ssig=icf0fEdwop&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/j3qzuKJ1gx081Slv5ZC80104124JvDpJ0E1G0.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4851194947108870&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,8143-g0,3601-g31,8013-g0,3601-g29,3601-g39,3601-g36,7598-g0,3601-g27,3601-g32,3601-g27&Expires=1727170904&ssig=iMBNiLDNA1&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/TlGfsgowgx080MAO30b60104123PDGdK0E1m0.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4835798445654040&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,8143-g0,3601-g31,8013-g0,3601-g39,3601-g36,7598-g0,3601-g36,3601-g27,3601-g27,3601-g38&Expires=1727171094&ssig=c3Y2cX88Ku&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/MUh9X0vegx07ZJmCxhby0104124TYG7k0E1K0.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4820936118173817&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,8143-g0,3601-g31,8013-g0,3601-g29,3601-g39,3601-g19,3601-g36,7598-g0,3601-g36,3601-g27,3601-g27&Expires=1727171144&ssig=lH86H3pSYd&KID=unistore,video',
    //                 'https://f.video.weibocdn.com/u0/exjI2XbGgx07WQin4B7G0104124VNrmr0E1K0.mp4?label=mp4_2160p&template=3840x2160.25.0&media_id=4780287633326161&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=3&ot=h&ps=3lckmu&uid=2xQhS1&ab=14258-g1,,3601-g32,6377-g0,3601-g32,3601-g29,8013-g0,3601-g29,3601-g39,3601-g28,1258-g0,3601-g19,3601-g36,7598-g0,3601-g27,3601-g38,3601-g37&Expires=1727171312&ssig=45t5aDNQ24&KID=unistore,video'
    //                 // 'http://skaomdeyb.hb-bkt.clouddn.com/SHANGHAI.mp4?e=1727148227&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:8ACMxx2EynsRCa--Vk6aI9yj1jc=',
    //                 // 'http://skaomdeyb.hb-bkt.clouddn.com/NEW%20YORK2.mp4?e=1727148255&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:TFmDWQeQxmbs0SYlmj1-_ZzSX4s=',
    //                 // 'http://skaomdeyb.hb-bkt.clouddn.com/NEW%20YORK1.mp4?e=1727148268&token=6_YlCr1ddcNLArlDojZQFTqywOpbDzyGV9p0aW8C:42GDs_ii_8Zl7o0QnJHljt7QZj8='
    //
    //             ].map((src, index) => (
    //                 <div key={index} className="bg-white bg-opacity-90 rounded-lg p-2 shadow-lg w-full text-center">
    //                     <video className="w-full rounded-lg shadow-md" controls  autoPlay muted>
    //                         <source src={src} type="video/mp4" />
    //                         Your browser does not support the video tag.
    //                     </video>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
};

export default VideoPlayerPage;
