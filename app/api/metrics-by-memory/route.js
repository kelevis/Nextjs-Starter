import { NextResponse } from 'next/server';

let pageviews = {
    count: 0,
    lastVisit: null
};

export async function GET(request) {

    pageviews.count = (pageviews.count || 0) + 1;
    pageviews.lastVisit = new Date().toISOString();

    const metrics = {
        pv: pageviews.count || 0,
        uv: 1234, // Default value
    };
    const token = request.cookies.get('token')   //
    return NextResponse.json({ metrics });

}
