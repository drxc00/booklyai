"use server";

import { TestData } from "@/tests/test.data";
import openai from "@/lib/openai";
import { Prompts } from "@/lib/prompts";
import prisma from "@/lib/prisma-db";
import DocumentBuilder from "@/components/pdf-components/document-builder";
import { renderToStream } from "@react-pdf/renderer";
import { buffer } from "node:stream/consumers";
import { BUCKET_NAME, getS3Client } from "@/lib/aws";
import { auth, signOut } from "@/lib/auth";
import { ENVIRONMENT, ERROR_MESSAGES, MESSAGES } from "@/lib/utils";
import { buildPDF } from "@/lib/generators";

export async function getS3Link(bookId: string, type: string): Promise<string> {
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${bookId}/${type}.pdf`;
}


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

// export const bookGenerator = streamResponse(async function* (bookId: string) {
//     // Get the userid and book data
//     const [userId, book] = await Promise.all([
//         getUserId(),
//         fetchBookData(bookId),
//     ]) as [string, BookDocument];

//     // Short circuit if no user id is found or no book data is found
//     if (!userId) throw Error(ERROR_MESSAGES.AUTH_FAILED);
//     if (!book) throw Error(ERROR_MESSAGES.NO_CHAPTER_DATA);

//     // Filter out chapters that are already generated and chapters that are already in the bookContents
//     const chaptersToGenerate = book.chapters.filter((chapter) => (
//         !book.bookContents.some((bookContent) => bookContent.title === chapter.title)
//     ));

//     // Initialize an array to store the generated contents
//     const generatedContents: BookChapter[] = [];
//     // Yield the chapter title for client-side updates
//     for (const chapter of chaptersToGenerate) {
//         const content = await generateChapter(chapter); // Generate the chapter content
//         generatedContents.push(content); // Push the generated content to the array
//         yield chapter.title; // Notify progress
//     }
//     // Yield Final message
//     yield MESSAGES.BUILDING_PDF;

//     // Build the PDF
//     // Concatenate the existing book contents with the generated contents
//     const fullBookData = { ...book, bookContents: [...book.bookContents, ...generatedContents] };
//     // Uses react-pdf's renderToStream api to generate a pdf stream
//     // Then convert the stream to a buffer
//     const buf = await buffer(await renderToStream(DocumentBuilder({ bookData: fullBookData }))); // Convert stream to buffer
//     // Invoke the pdf builder
//     await buildPDF({ bookId, buffer: buf, type: "final" });
// });

async function fetchBookData(bookId: string) {
    return prisma.books.findUniqueOrThrow({
        where: { id: bookId },
        select: {
            chapters: true,
            previewContent: true,
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

// export async function generateBookPreview(bookId: string): Promise<void> {
//     // Get user id
//     const userId = await getUserId();
//     // Retrieve only the chapters of the book.
//     const book = await fetchBookData(bookId);
//     // If no chapter data is found, throw an error
//     if (!book) throw Error("No book data found");

//     // Invoke the preview generation.
//     // This will generate the preview for the first chapter
//     const firstChapter = await generateChapter(book.chapters[0] as Chapter);

//     const bookData = {
//         ...book,
//         chapters: book.chapters as Chapter[],
//         bookContents: [firstChapter]
//     };

//     // Invoke the pdf builder
//     const buf: Buffer = await buffer(await renderToStream(DocumentBuilder({ bookData })));


//     // In this case, we also push the first chapter to the bookContents
//     // This prevents the book generator from overwriting the first chapter
//     await Promise.all([
//         buildPDF({ bookId, buffer: buf, type: "preview" }),
//         prisma.books.update({
//             where: {
//                 id: bookId
//             },
//             data: {
//                 isPreviewGenerated: true,
//                 bookContents: {
//                     push: firstChapter
//                 }
//             }
//         }),

//     ])
// }

// export async function generateChapterContent(chapter: Chapter, bookId: string): Promise<void> {
//     // Get user Id
//     const userId = await getUserId();
//     // For testing and development to not waste tokens
//     if (ENVIRONMENT === "test" || ENVIRONMENT === "development") {
//         await prisma.books.update({
//             where: {
//                 id: bookId,
//                 userId: userId
//             },
//             data: {
//                 bookContents: {
//                     push: await TestData.testBookContent()
//                 }
//             }
//         })

//         return;
//     }
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [
//                 { role: "system", content: Prompts.persona },
//                 { role: "user", content: Prompts.generateChapterContentPrompt(chapter) },
//             ],
//             temperature: 0.3,
//             response_format: {
//                 type: "json_schema",
//                 json_schema: {
//                     name: "chapter_content_schema",
//                     schema: {
//                         type: "object",
//                         properties: {
//                             title: {
//                                 type: "string",
//                                 description: "The title of the chapter",
//                             },
//                             introduction: {
//                                 type: "string",
//                                 description: "The introduction of the chapter",
//                             },
//                             subchapters: {
//                                 type: "array",
//                                 items: {
//                                     type: "object",
//                                     properties: {
//                                         title: {
//                                             type: "string",
//                                             description: "The title of the subchapter",
//                                         },
//                                         content: {
//                                             type: "string",
//                                             description: "The markdown content/paragraphs of the subchapter",
//                                         },
//                                     },
//                                 },
//                             },
//                             conclusion: {
//                                 type: "string",
//                                 description: "The conclusion of the chapter",
//                             },
//                         },
//                     },
//                 },
//             },
//         });
//         // Push chapter content to database
//         await prisma.books.update({
//             where: {
//                 id: bookId,
//                 userId: userId
//             },
//             data: {
//                 bookContents: {
//                     push: JSON.parse(completion.choices[0].message.content as string),
//                 },
//             }
//         });
//     } catch (error) {
//         throw error;
//     }
// };

export async function getBooks(numberOfBooks?: number): Promise<BookDocument[] | null> {
    try {
        // If 'numberOfBooks' is not provided, we return all the books
        const query = numberOfBooks ? { take: numberOfBooks } : {};
        const books = await prisma.books.findMany(query as object) as unknown as BookDocument[] | null;
        if (!books) throw Error(ERROR_MESSAGES.NO_BOOKS);
        return books;
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
        if (!book) throw Error(ERROR_MESSAGES.NO_BOOK_DATA);
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
            },
        });
        // Throw an error if no books are found
        if (!books) throw Error("Books not found");
        // Since the types of the returned book document differs from the defined type
        return books.map((book) => (
            {
                ...book,
                previewContent: book.previewContent as BookChapter,
                chapters: book.chapters as Chapter[]
            }
        )) as BookDocument[];
    } catch (error) {
        console.log(error); // Log the error
        return null; // Return null 
    }
}