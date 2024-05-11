// components/Layout.js

import { useState, useEffect } from 'react';
import styles from './Layout.module.css'; // 使用 CSS Modules

const Layout = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // 检查用户是否在暗色模式下
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDarkMode);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    return (
        <div className={darkMode ? styles.darkMode : styles.lightMode}>
            {/* 在这里放置你的页面内容 */}
            <button onClick={toggleDarkMode}>切换暗色模式</button>
            {children}
        </div>
    );
};

export default Layout;
