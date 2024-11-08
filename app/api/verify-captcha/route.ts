// app/api/verify-captcha/route.ts
import {NextResponse} from 'next/server';

// import { fetch } from 'undici'; // 或者使用 node-fetch
//
// const verifyCaptcha = async (token: string) => {
//     try {
//         const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
//             method: 'POST',
//             body: new URLSearchParams({
//                 secret: process.env.RECAPTCHA_SECRET_KEY as string,
//                 response: token,
//             }),
//             // 设置超时时间，例如 10 秒
//             timeout: 10000, // 超过 10 秒超时
//         });
//
//         if (!response.ok) {
//             console.error('Failed to verify CAPTCHA:', response.statusText);
//             throw new Error('Failed to verify CAPTCHA');
//         }
//
//         return response.json();
//     } catch (error) {
//         console.error('Error during CAPTCHA verification:', error);
//         throw error;
//     }
// };

import axios from 'axios';

// const verifyCaptcha = async (token: string) => {
//     try {
//         const response = await axios.post(
//             'https://www.google.com/recaptcha/api/siteverify',
//             new URLSearchParams({
//                 secret: process.env.RECAPTCHA_SECRET_KEY as string,
//                 response: token,
//             }),
//             { timeout: 10000 }  // 设置超时时间为10秒
//         );
//
//         if (response.status !== 200) {
//             console.error('Failed to verify CAPTCHA:', response.statusText);
//             throw new Error('Failed to verify CAPTCHA');
//         }
//
//         return response.data;
//     } catch (error) {
//         console.error('Error during CAPTCHA verification:', error);
//         throw error;
//     }
// };


// 配置代理
const verifyCaptcha = async (token: string) => {
    console.log('reCAPTCHA 密钥:', process.env.RECAPTCHA_SECRET_KEY);

    try {
        // 构建请求体, 打印请求体内容
        const params = new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY as string,
            response: token,
        });
        console.log("Request body:", params.toString());

        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY as string,
                response: token,
            }),

            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }

            // {
            //     timeout: 5000,
            //     // 设置代理
            //     proxy: {
            //         host: '127.0.0.1',  // 代理地址
            //         port: 7890,  // 代理端口
            //     },
            // }
        );
        if (response.data.success) {
            return response.data;
        } else {
            console.error('reCAPTCHA verification failed:', response.data['error-codes']);
            throw new Error('reCAPTCHA verification failed');
        }

    } catch (error) {
        console.error('Error during CAPTCHA verification:', error);
        throw error;
    }
};


export async function POST(req: Request) {
    const {token} = await req.json();
    console.log("token:", token)

    if (!token) {
        console.log("error, error is token is null")
        return NextResponse.json({success: false, message: 'Token is required'}, {status: 400});
    }
    try {
        const verificationResponse = await verifyCaptcha(token);

        if (verificationResponse.success) {
            return NextResponse.json({success: true});
        } else {
            console.log("error verifyCaptcha(token)")
            return NextResponse.json({success: false, error: verificationResponse['error-codes']}, {status: 400});
        }
    } catch (error) {
        console.log("error is:", error)
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500});
    }
}
