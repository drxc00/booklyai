import { getLambdaClient } from "@/lib/aws";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextRequest, NextResponse } from "next/server";

// Wrapper for the AWS Lambda Function
export async function POST(req: NextRequest) {
    // Destructure the request and get the bookId
    const { bookId, ...others } = await req.json();
    try {
        // Invoke the Lambda Function
        const lambda = getLambdaClient();
        const lambdaRequest = await lambda.send(new InvokeCommand({
            FunctionName: "bookly-lambda-dev-generatePreview",
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({ bookId: bookId }),
        }));

        console.log(new TextDecoder().decode(lambdaRequest.Payload));

        // Return the response
        return NextResponse.json({
            message: "Preview generated successfully",
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error generating preview", error: (error as Error).message }, { status: 500 });
    }
}