// Logo.js

import React from 'react';
import Image from 'next/image';
import styles from '@/app/styles/Logo.module.css'; // 导入 CSS 模块文件
import logo from "./logo.svg"

function Logo() {
    return (
        <div className={"flex flex-col justify-center items-center"} >
        <Image className={styles.logo}  src={logo} alt="Logo" width={100} height={100} priority/>
    </div>
);
}

export default Logo;
