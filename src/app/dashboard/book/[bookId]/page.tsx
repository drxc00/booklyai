import { getBookData } from "@/app/actions";
import Loader from "@/components/loader";
import PDFViewer from "@/components/pdf-viewer";

const isPreviewGenerated = async (bookId: string) => {
    const book = await getBookData(bookId);
    return book?.awsFinalId;
}

export default async function FinalPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;

    const isGenerated = await isPreviewGenerated(bookId);

    if (!isGenerated) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
                <Loader message="Generating your book, please hold on..." />
                <p className="mt-4 text-center text-gray-600">
                    You'll receive an email with updates shortly. Feel free to refresh the page in a few minutes to check the status.
                </p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-4rem)] max-w-md mx-auto">
            <PDFViewer bookId={bookId} type="final" />
        </div>
    );
}