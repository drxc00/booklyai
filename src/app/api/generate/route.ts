import { generateBookOutline } from "@/lib/generators";
import { TestData } from "@/tests/test.data";
import prisma from "@/lib/prisma-db";
import { ENVIRONMENT, ERROR_MESSAGES } from "@/lib/utils";
import { auth } from "@/lib/auth";

// Wrap the POST request with the auth handler to check if the user is authenticated
export const POST = auth(async function POST(req) {
    // Handle the request with proper error handling
    try {
        // We Destructure the request
        const { booktopic, targetaudience, bookdescription } = await req.json();

        // Throw an error if no session is found
        if (!req.auth) throw Error(ERROR_MESSAGES.AUTH_FAILED);

        // We check if the title and audience are provided
        if (!booktopic || !targetaudience || bookdescription) return Response.json({ error: "Missing title, audience, or description" }, { status: 400 });
        // Generate Book Outline
        const responseOutline: string | null = (
            // If we are in test or development mode, we use the test data to save tokens
            ENVIRONMENT === "test" || ENVIRONMENT === "development" ?
                JSON.stringify(await TestData.testBookOutline()) :
                await generateBookOutline(booktopic, targetaudience, bookdescription)
        );
        // We parse the JSON response
        const outlineJSON = JSON.parse(responseOutline as string);
        // Add Book Outline to the database
        // Idea is we track everything in the database
        // Starting from preview stage to final build
        const bookDocument = await prisma.books.create({
            data: {
                userId: req.auth.user?.id as string,
                title: outlineJSON.booktitle,
                topicPrompt: booktopic,
                audiencePrompt: targetaudience,
                descriptionPrompt: bookdescription,
                chapters: outlineJSON.chapters,
                isPreviewGenerated: false,
            }
        })
        // Return a JSON response with the outline and bookId
        return Response.json({ outline: responseOutline, bookId: bookDocument.id }, { status: 200 });
    }
    catch (error) {
        // Return an error response
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
})