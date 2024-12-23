import { createPresignedUrl, getBookData } from "@/app/actions";
import Loader from "@/components/loader";
import PDFViewer from "@/components/pdf-viewer";

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
        <div className="h-[calc(100vh-4rem)] max-w-md mx-auto">
            <PDFViewer url={signedUrl as string} />
        </div>
    );
}