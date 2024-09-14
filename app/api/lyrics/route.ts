import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// 处理 GET 请求，返回歌词数据
export async function GET() {
    try {
        // 假设歌词文件存储在 public/lyrics 目录下
        const lyricsDir = path.join(process.cwd(), 'public/lyrics');
        const filePath = path.join(lyricsDir, 'lyrics.lrc');

        const lyrics = fs.readFileSync(filePath, 'utf-8');

        return NextResponse.json({ lyrics });
    } catch (error) {
        console.error('Error reading lyrics:', error);
        return NextResponse.json({ error: 'Failed to load lyrics' }, { status: 500 });
    }
}
