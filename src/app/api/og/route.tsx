import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
    // Path to the SVG in the public folder
    const filePath = path.join(process.cwd(), 'public', 'og-image.png');

    // Read the SVG file
    const svg = await fs.readFile(filePath);

    // Return the SVG as the response with the appropriate content type
    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/png',
        },
    });
}
