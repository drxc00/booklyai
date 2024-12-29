"use server";

import prisma from "@/lib/prisma-db";
import { auth } from "@/lib/auth";
import { ERROR_MESSAGES } from "@/lib/utils";
import { BUCKET_NAME, getS3Client, getS3RequestPresigner, REGION } from "@/lib/aws";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { formatUrl } from "@aws-sdk/util-format-url";
import Logger from "@/lib/logger";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPresignedUrl(bookId: string, type: string): Promise<string | null> {
    try {
        // Fetch only the relevant book information
        const book = await prisma.books.findUniqueOrThrow({
            where: {
                id: bookId,
            },
            select: {
                awsPreviewId: true,
                awsFinalId: true
            }
        }) as unknown as BookDocument
        const presigner = getS3RequestPresigner();

        // Create a GET request from S3 url.
        const url = await presigner.presign(new HttpRequest({
            hostname: `${BUCKET_NAME}.s3.${REGION}.amazonaws.com`,
            protocol: "https",
            path: type === "final" ? book.awsFinalId : book.awsPreviewId
        }));

        return formatUrl(url);
    } catch (error) {
        Logger.error("AWS", (error as Error).message);
        return null;
    }
}

async function getUserId(): Promise<string> {
    const session = await auth();
    const userId = session?.user?.id;
    // Check if there is a valid session upon invocation
    if (!userId) throw Error("User not found"); //Throw an error if no session is found
    // Return the user id if a valid session is found
    return userId as string;
}

export async function getBooks(numberOfBooks?: number): Promise<BookDocument[] | null> {
    try {
        // Return only relevant information of books
        const books = await prisma.books.findMany({
            select: {
                title: true,
                topicPrompt: true,
                audiencePrompt: true,
                descriptionPrompt: true,
                createdAt: true,
            },
            take: numberOfBooks || undefined
        }) as unknown as BookDocument[];
        if (!books) throw Error(ERROR_MESSAGES.NO_BOOKS);
        return books;
    } catch (error) {
        Logger.error("Books", (error as Error).message);
        return null;
    }
}
export async function getBookData(bookId: string): Promise<BookDocument | null> {
    try {
        const book = await prisma.books.findUniqueOrThrow({
            where: {
                id: bookId,
            }
        });
        // Throw an error if no books are found
        if (!book) throw Error(ERROR_MESSAGES.NO_BOOK_DATA);
        // Not the best approach but the JsonBody type is not defined
        return book as unknown as BookDocument;
    } catch (error) {
        Logger.error("Books", (error as Error).message);
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
        return books as unknown as BookDocument[];
    } catch (error) {
        Logger.error("Books", (error as Error).message); // Log the error
        return null; // Return null 
    }
}

// Delete a book from the database
export async function deleteBook(bookId: string, redirectPath?: string): Promise<void> {
    try {
        const [userId, book] = await Promise.all([getUserId(), getBookData(bookId)]); // Get the user id and book data

        // Check if the book belongs to the user
        if (book?.userId !== userId) throw Error("Book does not belong to user");

        // Delete the book from the database and Delete the book from S3
        const s3Client = getS3Client();
        await Promise.all([
            prisma.books.delete({
                where: {
                    id: bookId
                }
            }),
            s3Client.send(new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: book.awsPreviewId
            }))
        ]);

        if (redirectPath) redirect(redirectPath);
        else revalidatePath("/dashboard"); // Revalidate the dashboard
        
    } catch (error) {
        Logger.error("Books", (error as Error).message);
        throw error;
    }
}