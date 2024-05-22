import React from 'react';
import { FontAwesomeIcon } from '@/node_modules/@fortawesome/react-fontawesome';
import { faStar } from '@/node_modules/@fortawesome/free-solid-svg-icons';
import styles from '../styles/RotatingIcon.module.css'; // 引入 CSS 模块文件

function RotatingIcon() {
    return (
        <div className={styles.container}>
        <FontAwesomeIcon icon={faStar} className={styles.icon} />
    </div>
);
}

export default RotatingIcon;
