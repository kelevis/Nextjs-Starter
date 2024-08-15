import {NextResponse} from 'next/server';

const pageData = {
    count: 0,
    lastVisit: null
};

export async function GET(request) {

    pageData.count = (pageData.count || 0) + 1;
    pageData.lastVisit = new Date().toISOString();

    const metrics = {
        pv: pageData.count || 0,
        uv: 1234, // Default value
    };

    console.log(pageData);

    const token = request.cookies.get('token')   //
    return NextResponse.json(metrics);

}
