"use server";

import { TestData } from "@/tests/test.data";
import openai from "@/lib/openai";
import { Prompts } from "@/lib/prompts";
import prisma from "@/lib/prisma-db";
import DocumentBuilder from "@/components/pdf-components/document-builder";
import { renderToStream } from "@react-pdf/renderer";
import { buffer } from "node:stream/consumers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, getS3Client } from "@/lib/aws";
import { auth, signOut } from "@/lib/auth";
import { ENVIRONMENT } from "@/lib/utils";

async function getUserId(): Promise<string> {
    const session = await auth();
    const userId = session?.user?.id;
    // Check if there is a valid session upon invocation
    if (!userId) throw Error("User not found"); //Throw an error if no session is found
    // Return the user id if a valid session is found
    return userId as string;
}


// Credits to https://github.com/vercel/next.js/discussions/51282#discussioncomment-7871563 for the streamChunk, streamResponse implementations
async function streamChunk<T>(generator: AsyncGenerator<T>) {
    const next = generator.next()
    return new Promise<StreamResponseChunk<T>>((resolve, reject) => {
        next.then(res => {
            if (res.done) resolve({ iteratorResult: res })
            else resolve({ iteratorResult: res, next: streamChunk(generator) })
        })
        next.catch(error => reject(error))
    })
}

function streamResponse<T, P extends any[]>(createGenerator: (...args: P) => AsyncGenerator<T>) {
    return async (...args: Parameters<typeof createGenerator>) => {
        const generator = createGenerator(...args)
        return streamChunk<T>(generator)
    }
}

export const bookGenerator = streamResponse(async function* (bookId: string) {
    const userId = await getUserId(); // Get the user id
    if (!userId) throw Error("Authentication failed. Please log in."); // Short circuit if no user id is found

    let GeneratedContents = []; // Initialize an array to store the generated contents
    const book = await fetchBookData(bookId); // Retrieve only the chapters of the book.

    // If no chapter data is found, throw an error
    if (!book) throw Error("No chapter data found");
    // Filter out chapters that are already generated and chapters that are already in the bookContents
    const chaptersToGenerate = book.chapters.filter((chapter) => (
        !book.bookContents.some((bookContent) => (bookContent as BookChapter).title === (chapter as Chapter).title)
    ));

    // Yield the chapter title for client-side updates
    for (const chapter of chaptersToGenerate) {
        // Generate the chapter content
        const content = await generateChapter(chapter as Chapter);
        // Push the generated content to the array
        GeneratedContents.push(content);
        // Yield the chapter title for client-progress
        yield `${(chapter as Chapter).title}`;
    }

    // Yield Final message
    yield `Building the PDF file`;

    // Build the PDF
    // Concatenate the existing book contents with the generated contents
    const fullBookData = {
        ...book,
        bookContents: [...book.bookContents, ...GeneratedContents] as BookChapter[], // Concatenate the existing book contents with the generated contents
        chapters: book.chapters as Chapter[],
    }
    // Create a book key for S3 bucket
    const bookKey = `${bookId}/final.pdf`;

    // Uses react-pdf's renderToStream api to generate a pdf stream
    // Then convert the stream to a buffer
    const buf = await buffer(await renderToStream(DocumentBuilder({ bookData: fullBookData }))); // Convert stream to buffer
    // Configure the upload Command 
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: bookKey,
        ContentType: "application/pdf",
        Body: buf as unknown as Buffer
    });
    // Upload to S3
    const s3Client = getS3Client();
    await s3Client.send(command);
    // Update the book document
    await prisma.books.update({
        where: {
            id: bookId,
            userId: userId
        },
        data: {
            awsFinalId: bookKey,
            isPurchased: true
        }
    });
});

async function fetchBookData(bookId: string) {
    return prisma.books.findUniqueOrThrow({
        where: { id: bookId },
        select: {
            chapters: true,
            bookContents: true,
            title: true,
        }
    });
}

export async function generateChapter(chapter: Chapter): Promise<BookChapter> {
    // For testing and development to not waste tokens
    if (ENVIRONMENT === "test" || ENVIRONMENT === "development") return await TestData.testBookContent();

    // Invoke the content generation
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: Prompts.persona },
            { role: "user", content: Prompts.generateChapterContentPrompt(chapter) },
        ],
        temperature: 0.3,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "chapter_content_schema",
                schema: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "The title of the chapter",
                        },
                        introduction: {
                            type: "string",
                            description: "The introduction of the chapter",
                        },
                        subchapters: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "The title of the subchapter",
                                    },
                                    content: {
                                        type: "string",
                                        description: "The markdown content/paragraphs of the subchapter",
                                    },
                                },
                            },
                        },
                        conclusion: {
                            type: "string",
                            description: "The conclusion of the chapter",
                        },
                    },
                },
            },
        },
    });

    // Return the generated content
    return JSON.parse(completion.choices[0].message.content as string);
}


export async function buildPDF(bookId: string, type: string): Promise<void> {
    // Get user id
    const userId = await getUserId();
    // We fetch the book data from the database.
    const book = await prisma.books.findUniqueOrThrow({
        where: {
            id: bookId,
            userId: userId
        }
    })
    // Uses react-pdf's renderToStream api to generate a pdf stream
    // Then convert the stream to a buffer
    const buf = await buffer(await renderToStream(DocumentBuilder({
        bookData: {
            ...book,
            bookContents: book.bookContents as BookChapter[],
            chapters: book.chapters as Chapter[],
        } as BookDocument
    }))); // Convert stream to buffer
    // Configure the upload Command 
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${bookId}/${type}.pdf`,
        ContentType: "application/pdf",
        Body: buf as unknown as Buffer
    })
    // Upload to S3
    const s3Client = getS3Client();
    await s3Client.send(command);
    // Update the book based on the type
    // If the type is preview, this means that the generated pdf is a preview
    // Otherwise it is the final pdf
    switch (type) {
        case "preview":
            await prisma.books.update({
                where: {
                    id: bookId,
                    userId: userId
                },
                data: {
                    awsPreviewId: `${bookId}/${type}.pdf`
                }
            })
            break;
        case "final":
            await prisma.books.update({
                where: {
                    id: bookId
                },
                data: {
                    awsFinalId: `${bookId}/${type}.pdf`,
                    isPurchased: true // Mark the book as purchased
                }
            })
            break;
    }
}


export async function generateBookPreview(bookId: string): Promise<void> {
    // Get user id
    const userId = await getUserId();
    // Retrieve only the chapters of the book.
    const previewChapter = await prisma.books.findUniqueOrThrow({
        where: {
            id: bookId,
            userId: userId // Double check that the book belongs to the user
        },
        select: {
            chapters: true
        },
    });
    // If no chapter data is found, throw an error
    if (!previewChapter) throw Error("No chapter data found");
    // Invoke the preview generation.
    // This is a void server action. We do not need to return anything
    await generateChapterContent(previewChapter.chapters[0] as Chapter, bookId);
    // Update the book by setting 'isPreviewGenerated' to true
    await prisma.books.update({
        where: {
            id: bookId
        },
        data: {
            isPreviewGenerated: true
        }
    });
}

export async function generateChapterContent(chapter: Chapter, bookId: string): Promise<void> {
    // Get user Id
    const userId = await getUserId();
    // For testing and development to not waste tokens
    if (ENVIRONMENT === "test" || ENVIRONMENT === "development") {
        await prisma.books.update({
            where: {
                id: bookId,
                userId: userId
            },
            data: {
                bookContents: {
                    push: await TestData.testBookContent()
                }
            }
        })

        return;
    }
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: Prompts.persona },
                { role: "user", content: Prompts.generateChapterContentPrompt(chapter) },
            ],
            temperature: 0.3,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "chapter_content_schema",
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                description: "The title of the chapter",
                            },
                            introduction: {
                                type: "string",
                                description: "The introduction of the chapter",
                            },
                            subchapters: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        title: {
                                            type: "string",
                                            description: "The title of the subchapter",
                                        },
                                        content: {
                                            type: "string",
                                            description: "The markdown content/paragraphs of the subchapter",
                                        },
                                    },
                                },
                            },
                            conclusion: {
                                type: "string",
                                description: "The conclusion of the chapter",
                            },
                        },
                    },
                },
            },
        });
        // Push chapter content to database
        await prisma.books.update({
            where: {
                id: bookId,
                userId: userId
            },
            data: {
                bookContents: {
                    push: JSON.parse(completion.choices[0].message.content as string),
                },
            }
        });
    } catch (error) {
        throw error;
    }
};

export async function getBooks(numberOfBooks?: number): Promise<BookDocument[] | null> {
    try {
        // If 'numberOfBooks' is not provided, we return all the books
        const query = numberOfBooks ? { take: numberOfBooks } : {};
        const books = await prisma.books.findMany(query as object);
        if (!books) throw Error("Books not found");
        // Since the types of the returned book document differs from the defined type
        // We override the types by mapping each item in the returned list with the defined type
        return books.map(book => (
            {
                ...book,
                bookContents: book.bookContents as BookChapter[],
                chapters: book.chapters as Chapter[],
            }
        )) as BookDocument[];
    } catch (error) {
        console.log(error);
        return null;
    }
}
export async function getBookData(bookId: string) {
    try {
        const book = await prisma.books.findUniqueOrThrow({
            where: {
                id: bookId,
            }
        });
        // Throw an error if no books are found
        if (!book) throw Error("Book not found");
        return book;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getUserBooks(): Promise<BookDocument[] | null> {
    try {
        const userId = await getUserId();
        const books = await prisma.books.findMany({
            where: {
                userId: userId
            }
        });
        // Throw an error if no books are found
        if (!books) throw Error("Books not found");
        // Since the types of the returned book document differs from the defined type
        return books.map((book) => (
            {
                ...book,
                bookContents: book.bookContents as BookChapter[],
                chapters: book.chapters as Chapter[]
            }
        )) as BookDocument[];
    } catch (error) {
        console.log(error); // Log the error
        return null; // Return null 
    }
}