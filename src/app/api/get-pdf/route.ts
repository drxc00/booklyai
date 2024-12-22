import { auth } from "@/lib/auth";
import { BUCKET_NAME, getS3RequestPresigner, REGION } from "@/lib/aws";
import { ERROR_MESSAGES } from "@/lib/utils";
import { parseUrl } from "@aws-sdk/url-parser";
import { NextRequest, NextResponse } from "next/server";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { formatUrl } from "@aws-sdk/util-format-url";

export const GET = auth(async function (req: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: ERROR_MESSAGES.AUTH_FAILED }, { status: 401 });

    try {
        const urlParams = new URL(req.url).searchParams;
        const KEY = urlParams.get('key');
        const TYPE = urlParams.get('type');

        if (!KEY || !TYPE) return NextResponse.json({ error: "Missing key or type parameter" }, { status: 400 });

        const presigner = getS3RequestPresigner();

        // Create a GET request from S3 url.
        const url = await presigner.presign(new HttpRequest({
            hostname: `${BUCKET_NAME}.s3.${REGION}.amazonaws.com`,
            protocol: "https",
            path: `${KEY}/${TYPE}.pdf`,
        }));

        return NextResponse.json(
            { url: formatUrl(url) },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
});