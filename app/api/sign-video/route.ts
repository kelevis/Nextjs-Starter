import COS from 'cos-nodejs-sdk-v5';

// import dotenv from 'dotenv';
// const env = process.env.NODE_ENV || 'development';
// dotenv.config({ path: `.env.${env}` });

// 处理 GET 请求，返回多个预签名的 URL
export async function GET() {
    try {
        const cos = new COS({
            SecretId: process.env.TENCENT_SECRET_ID, // 确保正确使用环境变量
            SecretKey: process.env.TENCENT_SECRET_KEY,
        });

        console.log('SecretId:', process.env.TENCENT_SECRET_ID);
        console.log('SecretKey:', process.env.TENCENT_SECRET_KEY);


        // 定义桶名称和对象路径
        const Bucket = 'kelevis-1317840261'; // 替换为你的 Bucket 名称
        const Region = 'ap-beijing'; // 替换为你的存储区域
        const Keys = ['飞越中国.mp4','nanjizhou.mp4', 'france.mp4', 'NEW YORK5.mp4']; // 文件名或路径的数组

        // 使用 Promise.all 生成多个预签名 URL
        const urls = await Promise.all(Keys.map(key => {
            return new Promise((resolve, reject) => {
                cos.getObjectUrl({
                    Bucket,
                    Region,
                    Key: key,
                    Sign: true, // 是否生成带签名的 URL
                    Expires: 60 * 3 , // URL 有效时间（秒），这里设置为1小时
                }, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Url);
                    }
                });
            });
        }));

        console.log('Pre-signed URLs:', urls);

        // 返回生成的预签名 URL 数组
        return new Response(JSON.stringify({ urls }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error generating URLs:', error);
        return new Response(JSON.stringify({ error: 'Error generating URLs' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
