import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'data/pageviews.json');

function processData(filePath ) {
    const data = fs.readFileSync(filePath, 'utf8');
    const dataJson = JSON.parse(data);
    dataJson.count = (dataJson.count || 0) + 1;
    dataJson.lastVisit = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(dataJson, null, 2), 'utf8');
    return dataJson
}

export async function GET(request) {
    const token = request.cookies.get('token')   //
    const dataJson= processData(filePath)
    const metrics = {
        pv: dataJson.count || 0,
        uv: 1234,
    };

    console.log(dataJson);

    return NextResponse.json(metrics);

}
