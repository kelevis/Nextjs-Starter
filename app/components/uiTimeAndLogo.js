// 在 JavaScript 和 TypeScript 中，导入模块时有两种主要方式：默认导入和命名导入。这两种方式有不同的语法和用途。
// "use client"
import timeStyles  from '@/app/styles/time.module.css';
// import reactLogoStyles  from '@/app/styles/Logo.module.css';
// import Image from 'next/image'; // 引入 next/image 组件
// import Reactimage from "@/app/components/RotaIcon"

import React, { useState, useEffect } from 'react';
import Logo from "@/app/components/uiReactLogo"

function TimeAndLogo({ text }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // 定时
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // 清除
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={"flex flex-col justify-center items-center "}  >
            <Logo/>

            {/*<Reactimage/>*/}


                <a className={timeStyles.a}>
                    {text}
                </a>
                <div className={timeStyles.card}>
                    <p className={timeStyles.time}>Time: {currentTime.toLocaleString()}</p>
                </div>

        </div>
    );
}

export default TimeAndLogo;
