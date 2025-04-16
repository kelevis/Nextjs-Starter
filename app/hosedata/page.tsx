// "use client"
// import {useMetamask} from "@/app/hooks/useMetamask";
// import {useListen} from "@/app/hooks/useListen";
// import React, {useEffect, useState} from 'react';
// import ZoomableChart from '@/app/components/ZoomableChart';
//
//
// const HomePage = () => {
//     const {dispatch} = useMetamask();
//     const listen = useListen();
//
//     const [dates, setDates] = useState<string[]>([]);
//     const [values, setValues] = useState<number[]>([]);
//
//     useEffect(() => {
//         if (typeof window !== undefined) {
//             const ethereumProviderInjected = typeof window.ethereum !== "undefined";
//             const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
//             const local = window.localStorage.getItem("metamaskState");
//
//             // user was previously connected, start listening to MM
//             if (local) {
//                 listen();
//             }
//
//             // local could be null if not present in LocalStorage
//             const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
//             dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
//         }
//         console.log("连接metamask成功！")
//
//     }, []);
//
//
//     useEffect(() => {
//         fetch('/chart_data.csv')
//             .then((res) => res.text())
//             .then((text) => {
//                 const lines = text.trim().split('\n');
//                 const data = lines.slice(1).map((line) => {
//                     const [date, volume] = line.split(',');
//                     return {date, volume: parseFloat(volume)};
//                 });
//
//                 setDates(data.map((item) => item.date));
//                 setValues(data.map((item) => item.volume));
//             });
//     }, []);
//
//     return (
//         <main className="p-4">
//             <h1 className="text-xl font-bold mb-4">成交量图表</h1>
//             <ZoomableChart dates={dates} values={values}/>
//         </main>
//     );
// };
//
// export default HomePage;

"use client"
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";
import React, {useEffect, useState} from 'react';
import ZoomableChart from '@/app/components/ZoomableChart';

const HomePage = () => {
    const {dispatch} = useMetamask();
    const listen = useListen();

    const [dates, setDates] = useState<string[]>([]);
    const [values, setValues] = useState<number[]>([]);
    const [chartType, setChartType] = useState<'line' | 'bar'>('line'); // ⭐ 图表类型 state

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            if (local) {
                listen();
            }

            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！")
    }, []);

    useEffect(() => {
        fetch('/chart_data.csv')
            .then((res) => res.text())
            .then((text) => {
                const lines = text.trim().split('\n');
                const data = lines.slice(1).map((line) => {
                    const [date, volume] = line.split(',');
                    return {date, volume: parseFloat(volume)};
                });

                setDates(data.map((item) => item.date));
                setValues(data.map((item) => item.volume));
            });
    }, []);

    return (
        <main className="p-4">
            <h1 className="text-xl font-bold mb-4">成交量图表</h1>

            {/* ⭐ 图表类型切换按钮 */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setChartType('line')}
                    className={`px-4 py-2 rounded ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    折线图
                </button>
                <button
                    onClick={() => setChartType('bar')}
                    className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                    柱状图
                </button>
            </div>

            <ZoomableChart dates={dates} values={values} chartType={chartType} />
        </main>
    );
};

export default HomePage;

