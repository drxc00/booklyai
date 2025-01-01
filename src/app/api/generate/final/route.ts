import { getBookData } from "@/app/actions";
import { getLambdaClient } from "@/lib/aws";
import Logger from "@/lib/logger";
import prisma from "@/lib/prisma-db";
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
        Logger.info("Webhook", "Order created");

        // Validate the request
        // We check if there is custom data and if the userId and bookId are valid

        const customData = data.meta.custom_data;

        if (
            !customData ||
            typeof customData.userId !== "string" ||
            typeof customData.bookId !== "string" ||
            typeof customData.email !== "string" ||
            !customData.email.includes("@")
        ) {
            Logger.error("Webhook", "Invalid or missing custom_data");
            return NextResponse.json({ error: "Invalid custom_data" }, { status: 400 });
        }

        // Check if the custom data is valid
        const [book] = await Promise.all([
            getBookData(customData.bookId)
        ]);

        if (!book) {
            Logger.error("Webhook", `Invalid book: ${customData.bookId}`);
            return NextResponse.json({ error: "Invalid book" }, { status: 400 });
        }

        // Finally we check if the book is already paid/already generated
        if (book.isPurchased || book.awsFinalId) {
            Logger.error("Webhook", `Book already paid or generated: ${customData.bookId}`);
            return NextResponse.json({ error: "Book already paid or generated" }, { status: 400 });
        }

        // Update the book status to purchased
        const bookPurchasedPromise = prisma.books.update({
            where: {
                id: customData.bookId
            },
            data: {
                isPurchased: true
            }
        });

        // Invoke lambda function
        const lambda = getLambdaClient();
        const lambdaPromise = lambda.send(new InvokeCommand({
            FunctionName: `${process.env.AWS_LAMBDA_NAME}-generateFinal`,
            InvocationType: "Event",
            Payload: JSON.stringify({ userId: customData.userId, bookId: customData.bookId, email: customData.email })
        }));

        // wait for the promises to resolve
        await Promise.all([bookPurchasedPromise, lambdaPromise]);

        // Return the response
        return NextResponse.json({
            message: "Success",
        }, { status: 200 });

    } catch (error) {
        Logger.error("AWS", (error as Error).message);;
        return NextResponse.json({ message: "Error generating preview", error: (error as Error).message }, { status: 500 });
    }
}