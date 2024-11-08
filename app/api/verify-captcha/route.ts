import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { token } = req.body;

    // 在环境变量中保存你的 secret key
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
        {
            method: 'POST',
        }
    );

    const data = await response.json();

    if (data.success && data.score > 0.5) {
        // 验证通过，可以继续进行后续操作
        res.status(200).json({ success: true });
    } else {
        // 验证失败或评分过低
        res.status(400).json({ success: false, error: 'Verification failed' });
    }
}
