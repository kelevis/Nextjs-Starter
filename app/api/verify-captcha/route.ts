// app/api/verify-captcha/route.ts
import {NextResponse} from 'next/server';
import axios from 'axios';

const verifyCaptcha = async (token: string) => {
    console.log('reCAPTCHA 密钥:', process.env.RECAPTCHA_SECRET_KEY);
    console.log('token:', token);

    try {
        // // 构建请求体
        // const params = new URLSearchParams({
        //     secret: process.env.RECAPTCHA_SECRET_KEY as string,
        //     response: token,
        // });
        // console.log("Request body:", params.toString());
        //
        // // 发送请求到 reCAPTCHA v3 验证 API
        // const response = await axios.post(
        //     'https://www.google.com/recaptcha/api/siteverify',
        //     params,
        //     {
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     }
        // );
        //
        // // v3 返回验证结果
        // if (response.data.success && response.data.score > 0.5) {
        //     // `score` 判断风险等级，0-1之间，0.5 是阈值
        //     return response.data;
        // } else {
        //     console.error('reCAPTCHA v3 verification failed:', response.data['error-codes']);
        //     throw new Error('reCAPTCHA verification failed');
        // }


        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY as string,
                response: token,
            }),
        });

        if (!response.ok) {
            console.error('Failed to verify CAPTCHA:', response.statusText);
            throw new Error('Failed to verify CAPTCHA');
        }

        return response.json();


    } catch (error) {
        console.error('Error during CAPTCHA verification:', error);
        throw error;
    }
};

export async function POST(req: Request) {
    const {token} = await req.json();

    if (!token) {
        console.log("Error: token is null");
        return NextResponse.json({success: false, message: 'Token is required'}, {status: 400});
    }

    try {
        // return NextResponse.json({ success: true });

        const verificationResponse = await verifyCaptcha(token);

        if (verificationResponse.success) {
            return NextResponse.json({success: true});
        } else {
            console.log("Error: verifyCaptcha failed");
            return NextResponse.json({success: false, error: verificationResponse['error-codes']}, {status: 400});
        }


    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500});
    }
}
