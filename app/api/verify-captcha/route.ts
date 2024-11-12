// app/api/verify-captcha/route.ts
import {NextResponse} from 'next/server';
import axios from 'axios';


export async function POST(req: Request) {
    const {token} = await req.json();

    if (!token) {
        console.log("Error: token is null");
        return NextResponse.json({code: false, message: 'Token is required'}, {status: 400});
    }

    try {
// --------------------------------- reCAPTCHA-v2 ---------------------------------------------------------------------
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY as string,
                response: token,
            }),
        });
        if (!response.ok) {
            console.error('Failed to verify CAPTCHA:', response.statusText);
            return NextResponse.json({code: false}, {status: 400});
        }
        return NextResponse.json({code: true});


// --------------------------------- reCAPTCHA-v3 ---------------------------------------------------------------------
        // 解析响应数据, `score` 判断风险等级，0-1之间，0.5 是阈值
        // const {token} = await req.json();
        // const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        //     method: 'POST',
        //     body: new URLSearchParams({
        //         secret: process.env.RECAPTCHA_SECRET_KEY as string,
        //         response: token,
        //     }),
        // });
        // const data = await response.json();
        // console.log("response data is:", data)
        //
        // if (data.success && data.score > 0.5) {
        //     return data;
        // } else {
        //     console.error('reCAPTCHA v3 verification failed:', data['error-codes']);
        //     return NextResponse.json({code: false}, {status: 400});
        // }
// ------------------------------------------------------------------------------------------------------

    } catch (error) {
        console.log("Error is:", error);
        return NextResponse.json({code: false, message: 'Internal server error'}, {status: 500});
    }
}
