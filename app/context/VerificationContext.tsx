"use client"
// app/context/VerificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const VerificationContext = createContext<{ isVerified: boolean; setVerified: (verified: boolean) => void } | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isVerified, setVerified] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('isVerified');
        }
        return false;
    });

    useEffect(() => {
        if (isVerified) {
            localStorage.setItem('isVerified', 'true');
        }
    }, [isVerified]);

    return (
        <VerificationContext.Provider value={{ isVerified, setVerified }}>
            {children}
        </VerificationContext.Provider>
    );
};

export const useVerification = () => {
    const context = useContext(VerificationContext);
    if (!context) {
        throw new Error('useVerification must be used within a VerificationProvider');
    }
    return context;
};
