"use client"
// app/page.tsx
import { useVerification } from '@/app/context/VerificationContext';
import Wallet from '@/app/components/Wallet';
import Recaptcha from '@/app/components/Recaptcha';
import { useListen } from '@/app/hooks/useListen';
import { useMetamask } from '@/app/hooks/useMetamask';
import { useEffect, useState } from 'react';
const Home = () => {

  const { isVerified, setVerified } = useVerification(); // 使用 setVerified
  const { dispatch } = useMetamask();
  const listen = useListen();
  const [error, setError] = useState<string | null>(null); // 用来存储错误消息

  // const handleVerify = (token: string | null) => {
  //   if (token) {
  //     setVerified(true); // 使用 setVerified
  //     // 这里可以添加进一步的验证逻辑
  //   }
  // };


  const handleVerify = async (token: string | null) => {
    console.log("token is:",token)
    if (token) {
      const response = await fetch('/api/verify-captcha', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setVerified(true); // 更新状态
      } else {
        setError('验证码验证失败，请重新尝试。'); // 验证失败，设置错误信息
        // 处理验证失败的逻辑
        console.error('Verification failed:', data.error);
      }


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
        {error && <div className="error-message">{error}</div>}

        {isVerified && <Wallet />}
      </>
  );
};

export default Home;
