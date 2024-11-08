// app/api/verify-captcha/route.ts
import { NextResponse } from 'next/server';

const verifyCaptcha = async (token: string) => {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY as string,
            response: token,
        }),
    });

    return response.json();
};

export async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token is required' }, { status: 400 });
    }

    try {
        const verificationResponse = await verifyCaptcha(token);

        if (verificationResponse.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: verificationResponse['error-codes'] }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
