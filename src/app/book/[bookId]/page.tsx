import { deleteBook, getBookData } from "@/app/actions";
import Loader from "@/components/loader";
import PDFViewer from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { generatedSinceWhen } from "@/lib/utils";
import { BookmarkX, MailSearch, TicketX, Trash2, X } from "lucide-react";
import getCachedSession from "@/lib/session-cache";
import ForbiddenAccess from "@/components/forbidden-access";
import DownloadPDF from "@/components/download-pdf";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BUCKET_NAME, REGION } from "@/lib/aws";

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
                {book?.isPurchased ? (
                    <div className="flex flex-col items-center gap-2">
                        <MailSearch className="h-24 w-24 " />
                        <p className="text-3xl">Your book is being generated. You&apos;ll receive an email shortly.</p>
                    </div>
                ) : <X  className="h-24 w-24 text-red-500" />}
                <p className="mt-2 text-center text-gray-600 max-w-2xl">
                    {book?.isPurchased
                        ? "Please check your inbox or spam folder. You can refresh this page in a few minutes to check the status."
                        : "It seems like you haven't purchased the book yet. Please complete your purchase to proceed. If you've just made a payment, please wait a few moments for the system to process it."}
                </p>
            </div>
        )
    }

    return (
        <div className="w-screen max-w-5xl grid items-center justify-items-center mx-auto">
            <div className="grid grid-cols-1 text-center mt-8 lg:grid-cols-2 lg:text-start lg:mt-0 lg:gap-8 gap-0 items-center">
                <div className="space-y-2 p-6 lg:p-0 w-full max-w-2xl justify-center">
                    <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
                    <div className="flex gap-4 justify-center lg:justify-start text-muted-foreground items-center">
                        <p>Chapters: {book.chapters.length}</p>
                        <p>Created {generatedSinceWhen(new Date(book.createdAt as Date))} ago</p>
                    </div>
                    <DownloadPDF presignedUrl={`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${book.awsFinalId}` as string} fileName={book.title} />
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
                <PDFViewer url={`https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${book.awsFinalId}` as string} />
            </div>
        </div>
    );
}