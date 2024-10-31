"use client"
// app/page.tsx
import { useEffect } from 'react';
import { useVerification } from '@/app/context/VerificationContext';
import Wallet from '@/app/components/Wallet';
import Recaptcha from '@/app/components/Recaptcha';
import { useListen } from '@/app/hooks/useListen';
import { useMetamask } from '@/app/hooks/useMetamask';

const Home = () => {
  const { isVerified, setVerified } = useVerification(); // 使用 setVerified
  const { dispatch } = useMetamask();
  const listen = useListen();

  const handleVerify = (token: string | null) => {
    if (token) {
      setVerified(true); // 使用 setVerified
      // 这里可以添加进一步的验证逻辑
    }
  };

  useEffect(() => {
    if (isVerified) {
      // 继续执行初始化逻辑
      if (typeof window !== 'undefined') {
        const ethereumProviderInjected = typeof window.ethereum !== 'undefined';
        const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
        const local = window.localStorage.getItem('metamaskState');

        if (local) {
          listen();
        }

        const { wallet, balance } = local ? JSON.parse(local) : { wallet: null, balance: null };

        dispatch({ type: 'pageLoaded', isMetamaskInstalled, wallet, balance });
      }
    }
  }, [isVerified]);

  return (
      <>
        {!isVerified && <Recaptcha onVerify={handleVerify} />}
        {isVerified && <Wallet />}
      </>
  );
};

export default Home;
