// // components/Recaptcha.tsx
// import React, { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
//
// const Recaptcha = ({ onVerify }: { onVerify: (token: string | null) => void }) => {
//     return (
//         <ReCAPTCHA
//             sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
//             // sitekey="6LeZG3EqAAAAANcsv-xAyS4UdrXGBUVeyb8BYoTw"
//             onChange={onVerify}
//         />
//     );
// };
//
// export default Recaptcha;

import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const Recaptcha = ({ onVerify }: { onVerify: (token: string | null) => void }) => {
    const captchaRef = useRef<ReCAPTCHA | null>(null);

    // 获取 token
    const handleVerify = async () => {
        const token = await captchaRef.current?.execute();  // 调用 execute 方法获取 token
        if (token) {
            onVerify(token);  // 将 token 传递给父组件进行后端验证
        }
    };

    return (
        <div>
            <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}  // 使用你的 site key
                size="invisible"  // 设置为不可见模式
                ref={captchaRef}  // 引用 ReCAPTCHA 组件
            />
            <button onClick={handleVerify}>Verify</button>
        </div>
    );
};

export default Recaptcha;

