import { createPresignedUrl, getBookData } from "@/app/actions";
import Loader from "@/components/loader";
import PDFViewer from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { generatedSinceWhen } from "@/lib/utils";
import { Download } from "lucide-react";

export default async function FinalPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;

    const book = await getBookData(bookId);

    if (!book?.awsFinalId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
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
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-row gap-10 items-center">
                <div className="space-y-4 w-full max-w-xl">
                    <h1 className="font-serif text-3xl font-bold">{book.title}</h1>
                    <div className="flex gap-4 text-muted-foreground">
                        <p>Chapters: {book.chapters.length}</p>
                        <p>Created {generatedSinceWhen(new Date(book.createdAt as Date))} ago</p>
                    </div>
                    <Button className="w-full">
                        <Download className="mr-2" />
                        <a href={signedUrl as string}>Download</a>
                    </Button>
                </div>
                <PDFViewer url={signedUrl as string} />
            </div>
        </div>
    );
}