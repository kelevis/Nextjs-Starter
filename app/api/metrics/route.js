// app/api/metrics/route.ts

import {NextResponse} from 'next/server';
import fs from 'fs';
import path from 'path';

// const filePath = path.resolve(process.cwd(), 'data/pageviews.json');
git
let pageviews = {
    count: 0,
    lastVisit: null
};

// Function to increment the count and update the last visit
function incrementPageviews() {
    pageviews.count = (pageviews.count || 0) + 1;
    pageviews.lastVisit = new Date().toISOString();
}


export async function GET(request) {

    const token = request.cookies.get('token')   //

    // const data = fs.readFileSync(filePath, 'utf8');
    // const pageviews = JSON.parse(data);
    // pageviews.count = (pageviews.count || 0) + 1;
    // pageviews.lastVisit = new Date().toISOString();
    // // Write the updated count back to the file
    // fs.writeFileSync(filePath, JSON.stringify(pageviews, null, 2), 'utf8');

// Usage example
    incrementPageviews();
    console.log(pageviews);

    // console.log("filePath:", filePath)
    // console.log("data:", data)
    // console.log("pageviews", pageviews)
    // console.log("pageviews.count", pageviews.count)

    // Default values for other metrics
    const metrics = {
        pv: pageviews.count || 0,
        uv: 1234, // Default value
    };

    return NextResponse.json(metrics);

}
