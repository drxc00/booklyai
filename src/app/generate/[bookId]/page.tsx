

import React from "react";
import PDFViewer from "@/components/pdf-viewer";
import { auth } from "@/lib/auth";
import { deleteBook, getBookData } from "@/app/actions";
import PurchaseButton from "@/components/purchase-button";
import { Session } from "next-auth";
import ForbiddenAccess from "@/components/forbidden-access";
import { BookmarkX, Trash2 } from "lucide-react";
import { BUCKET_NAME, REGION } from "@/lib/aws";
import { redirect } from "next/navigation";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


export default async function BookGenerate({ params }: { params: Promise<{ bookId: string }> }) {
    // Extract `bookId` from params
    const { bookId } = await params;
    const [session, book] = await Promise.all([
        auth(),
        getBookData(String(bookId))
    ]);

    if (!book) {
        return (
            <div className="flex flex-col items-center text-center justify-center h-[calc(100vh-8rem)]">
                <div className="flex flex-col items-center">
                    <BookmarkX className="h-24 w-24 text-red-500" />
                    <p className="text-3xl">Book not found!</p>
                    <p className="text-muted-foreground">The book you are looking for does not exist.</p>
                </div>
            </div>
        )
    }

    // Check if book belongs to user
    if (book?.userId !== session?.user?.id) {
        return <ForbiddenAccess />
    }

    if (book?.isPurchased) redirect(`/book/${bookId}`);

    // Render the preview
    return (
        <div className="max-w-5xl grid items-center justify-items-center mx-auto">
            <div className="grid grid-cols-1 text-center mt-10 lg:grid-cols-2 lg:text-start lg:mt-0 gap-8 items-center">
                <div className="space-y-2 p-6 lg:p-0 w-full max-w-2xl justify-center">
                    <p className="text-3xl font-semibold font-serif">Your book preview is ready!</p>
                    <p className="text-muted-foreground">Review the preview and, when you&apos;re satisfied, take the next step to finish and bring your book to life.</p>
                    <div className="mt-4 flex flex-col gap-2">
                        <PurchaseButton bookId={bookId} session={session as Session} />
                        <div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="font-bold font-serif">Delete Book?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                            Are you sure you want to delete this book?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel >Cancel</AlertDialogCancel>
                                        <form action={
                                            async () => {
                                                "use server";
                                                await deleteBook(book.id as string, "/library");
                                            }
                                        }>
                                            <Button variant="destructive" type="submit" className="w-full">
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <p className="text-muted-foreground text-xs text-center mt-2">Once deleted, a book cannot be recovered.</p>
                        </div>
                    </div>
                </div>
                <PDFViewer url={`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${book.awsPreviewId}` as string} />
            </div>
        </div>
    );
}
