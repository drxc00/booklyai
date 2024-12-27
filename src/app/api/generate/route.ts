import { ERROR_MESSAGES } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { requestLimiterByUserId } from "@/lib/limiter";
import { getLambdaClient } from "@/lib/aws";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { NextRequest } from "next/server";
import { generateFormSchema } from "@/lib/form-schemas";

// Wrap the POST request with the auth handler to check if the user is authenticated
export const POST = async (req: NextRequest) => {
    // Handle the request with proper error handling
    const session = await auth();
    // Throw an error if the user is not authenticated
    if (!session) return Response.json({ error: ERROR_MESSAGES.AUTH_FAILED }, { status: 401 });
    try {
        // Apply Rate limiting
        const rateLimiter = await requestLimiterByUserId(session.user?.id as string, 1, 60000);
        if (!rateLimiter.allowed) return Response.json({ error: rateLimiter.message }, { status: 429 });

        // We Destructure the request
        const { booktopic, targetaudience, bookdescription } = await req.json();
        // We check if the title and audience are provided
        if (!booktopic || !targetaudience || bookdescription) return Response.json({ error: "Missing title, audience, or description" }, { status: 400 });

        // Sanitize the request data
        // Compare with zod schema
        const sanitize = generateFormSchema.safeParse({ booktopic, targetaudience, bookdescription });
        if (!sanitize.success) {
            return Response.json({ error: sanitize.error.errors.map(err => err.message) }, { status: 400 });
        }

        // Invoke lambda function
        const lambda = getLambdaClient();
        const lambdaRequest = await lambda.send(new InvokeCommand({
            FunctionName: `${process.env.AWS_LAMBDA_NAME}-generatePreview`,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({
                userId: session.user?.id as string,
                bookTopic: booktopic,
                bookAudience: targetaudience,
                bookDescription: bookdescription
            })
        }));

        // Parse the JSON response
        const { body } = JSON.parse(new TextDecoder().decode(lambdaRequest.Payload));
        const { bookId } = JSON.parse(body);

        // Return a JSON response with the outline and bookId
        return Response.json({ bookId: bookId }, { status: 200 });
    }
    catch (error) {
        // Return an error response
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}