import openai from "./openai";
import prisma from "./prisma-db";
import { Prompts } from "./prompts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, getS3Client } from "./aws";

export async function generateBookOutline(
    booktopic: string,
    targetaudience: string,
    bookdescription: string
): Promise<string | null> {

    // Construct the prompt to generate the outline
    const outlinePrompt = Prompts.generateOutlinePrompt(booktopic, targetaudience, bookdescription);

    // Invokes the OpenAI API to generate the outline
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: Prompts.persona }, // Set The Persona Of the Model
            { role: "user", content: outlinePrompt } // Set The Prompt
        ],
        // We enable response formatting, specifically the JSON schema format
        // The schema defines the structure of the response
        // We detine properties and their respective types, as well as descriptions-
        // -to provide context to the llm.
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "book_outline_schema",
                schema: {
                    type: "object",
                    properties: {
                        booktitle: {
                            type: "string",
                            description: "The title of the book"
                        },
                        chapters: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "The title of the chapter"
                                    },
                                    subchapters: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                title: {
                                                    type: "string",
                                                    description: "The title of the subchapter"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    // Extract the outline from the response and return as a string.
    return completion.choices[0].message.content as string;
}

interface BuildPDFInterface {
    bookId: string;
    buffer: any;
    type: string;
}

export async function buildPDF({
    bookId,
    buffer,
    type
}: BuildPDFInterface): Promise<void> {
    // We fetch the book data from the database.
    const book = await prisma.books.findUniqueOrThrow({
        where: {
            id: bookId,
        }
    })
    // Get the S3 Client
    const s3Client = getS3Client();

    // Configure the upload Command 
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${bookId}/${type}.pdf`,
        ContentType: "application/pdf",
        Body: buffer as unknown as Buffer
    })

    // Update the database based on the type
    const updateData = {
        preview: {
            isPreviewGenerated: true,
            awsPreviewId: `${bookId}/${type}.pdf`
        },
        final: {
            awsFinalId: `${bookId}/${type}.pdf`,
            isPurchased: true
        }
    }

    // Perform the upload and update
    await Promise.all([
        s3Client.send(command),
        prisma.books.update({
            where: {
                id: bookId
            },
            data: updateData[type as keyof typeof updateData]
        })
    ])
}