import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
    // 假设音乐文件存储在 public/music 目录下
    const musicDir = path.join(process.cwd(), 'public/music');
    const files = fs.readdirSync(musicDir);

    // 随机返回一个音乐文件
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const musicUrl = `/music/${randomFile}`;

    return NextResponse.json({ url: musicUrl });
}
