import { getLambdaClient } from "@/lib/aws";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const data = JSON.parse(rawBody);

        // Check if the event_name is order_created
        if (data.meta.event_name !== "order_created") return NextResponse.json("Invalid request", { status: 400 });

        // Verify lemonsqueezy signature
        const signature = Buffer.from(
            req.headers.get("X-Signature") ?? "",
            "hex"
        );

        // Check if the signature length and rawBody length are greater than 0
        if (signature.length === 0 || rawBody.length === 0) return NextResponse.json("Invalid request", { status: 400 });

        const hmac = Buffer.from(
            crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET as string).update(rawBody).digest("hex"),
            "hex"
        );


        // Check if the signature is valid
        if (!crypto.timingSafeEqual(hmac, signature)) {
            return NextResponse.json("Invalid request", { status: 400 });
        }
        // Logging
        console.log("[Webhook][LemonSqueezy] Final order created");

        const lambda = getLambdaClient();
        await lambda.send(new InvokeCommand({
            FunctionName: "bookly-lambda-dev-generateFinal",
            InvocationType: "Event",
            Payload: JSON.stringify({ bookId: data.meta.custom_data.bookId, email: data.meta.custom_data.email })
        }));


        // Return the response
        return NextResponse.json({
            message: "Success",
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error generating preview", error: (error as Error).message }, { status: 500 });
    }
}