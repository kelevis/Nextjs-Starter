// app/api/user/route.txt

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'GET request received' });
}

export async function POST(req) {
    const data = await req.json();
    return NextResponse.json({ message: 'POST request received', data });
}

export async function PUT() {
    return NextResponse.json({ message: 'PUT request received' });
}

export async function DELETE() {
    return NextResponse.json({ message: 'DELETE request received' });
}
