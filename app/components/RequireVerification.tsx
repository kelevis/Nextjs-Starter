"use client";

import React, { useEffect } from 'react';
import Recaptcha from '@/app/components/Recaptcha'; // 你的 reCAPTCHA 组件
import {useVerification} from '@/app/context/VerificationContext';

const RequireVerification: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isVerified, setVerified } = useVerification();

    const handleVerify = async (token: string | null) => {
        if (token) {
            const response = await fetch('/api/verify-captcha', {
                method: 'POST',
                body: JSON.stringify({ token }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (data.success) {
                setVerified(true);
            } else {
                console.error('Verification failed. data is:',data);
            }
        }
    };

    return (
        <>
            {isVerified ? (
                children
            ) : (
                <Recaptcha onVerify={handleVerify} />
            )}
        </>
    );
};

export default RequireVerification;
