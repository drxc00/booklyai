import { createPresignedUrl, deleteBook, getBookData } from "@/app/actions";
import Loader from "@/components/loader";
import PDFViewer from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { generatedSinceWhen } from "@/lib/utils";
import { BookmarkX, Trash2 } from "lucide-react";
import getCachedSession from "@/lib/session-cache";
import ForbiddenAccess from "@/components/forbidden-access";
import DownloadPDF from "@/components/download-pdf";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default async function FinalPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;

    const [book, session] = await Promise.all([
        getBookData(bookId),
        getCachedSession(),
    ])

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

    if (book?.userId !== session?.user?.id) {
        return <ForbiddenAccess />
    }

    if (!book?.awsFinalId) {
        return (
            <div className="flex flex-col items-center text-center justify-center h-[calc(100vh-8rem)]">
                <Loader message="Generating your book, please hold on..." />
                <p className="mt-4 text-center text-gray-600">
                    You&apos;ll receive an email with updates shortly. Feel free to refresh the page in a few minutes to check the status.
                </p>
            </div>
        )
    }

    // generate signed Url
    const signedUrl = await createPresignedUrl(bookId, "final");

    return (
        <div className="max-w-5xl grid items-center justify-items-center mx-auto">
            <div className="grid grid-cols-1 text-center mt-8 lg:grid-cols-2 lg:text-start lg:mt-0 lg:gap-8 gap-0 items-center">
                <div className="space-y-2 p-6 lg:p-0 w-full max-w-2xl justify-center">
                    <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
                    <div className="flex gap-4 justify-center lg:justify-start text-muted-foreground items-center">
                        <p>Chapters: {book.chapters.length}</p>
                        <p>Created {generatedSinceWhen(new Date(book.createdAt as Date))} ago</p>
                    </div>
                    <DownloadPDF presignedUrl={signedUrl as string} fileName={book.title} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className="flex flex-col mt-2 cursor-pointer w-full border border-muted-foreground border-dashed rounded-md p-2 bg-muted/40">
                                <span className="text-red-500 text-sm w-full text-center">
                                    Delete your book
                                </span>
                                <p className="text-xs text-center text-muted-foreground">Once you delete your book, you will no longer be able to access it.</p>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="font-bold font-serif">Delete Book?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    Are you sure you want to delete this book?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <form action={
                                    async () => {
                                        "use server";
                                        await deleteBook(book.id as string, "/dashboard");
                                    }
                                }>
                                    <Button variant="secondary" type="submit" className="w-full">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </form>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <PDFViewer url={signedUrl as string} />
            </div>
        </div>
    );
}