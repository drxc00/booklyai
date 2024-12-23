import {  ERROR_MESSAGES } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { requestLimiterByUserId } from "@/lib/limiter";
import { getLambdaClient } from "@/lib/aws";
import { InvokeCommand } from "@aws-sdk/client-lambda";

// Wrap the POST request with the auth handler to check if the user is authenticated
export const POST = auth(async function POST(req) {
    // Handle the request with proper error handling
    try {
        // Apply Rate limiting
        const rateLimiter = await requestLimiterByUserId(req.auth?.user?.id as string, 1, 60000);
        if (!rateLimiter.allowed) return Response.json({ error: rateLimiter.message }, { status: 429 });
        // Throw an error if no session is found
        if (!req.auth) throw Error(ERROR_MESSAGES.AUTH_FAILED);
        // We Destructure the request
        const { booktopic, targetaudience, bookdescription } = await req.json();
        // We check if the title and audience are provided
        if (!booktopic || !targetaudience || bookdescription) return Response.json({ error: "Missing title, audience, or description" }, { status: 400 });
        // Invoke lambda function
        const lambda = getLambdaClient();
        const lambdaRequest = await lambda.send(new InvokeCommand({
            FunctionName: "bookly-lambda-dev-generatePreview",
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({
                userId: req.auth.user?.id as string,
                bookTopic: booktopic,
                bookAudience: targetaudience,
                bookDescription: bookdescription
            })
        }));

        // Parse the JSON response
        const { status, body } = JSON.parse(new TextDecoder().decode(lambdaRequest.Payload));
        const { message, bookId } = JSON.parse(body);

        // Return a JSON response with the outline and bookId
        return Response.json({ bookId: bookId }, { status: 200 });
    }
    catch (error) {
        // Return an error response
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
})