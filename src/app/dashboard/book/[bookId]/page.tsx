import PDFViewer from "@/components/pdf-components/pdf-viewer";

export default async function FinalPage({ params }: { params: Promise<{ bookId: string }> }) {
    const { bookId } = await params;
    const pdfUrl = `https://booklyai.s3.ap-southeast-2.amazonaws.com/${bookId}/final.pdf`;

    return (
        <div className="h-[calc(100vh-4rem)] max-w-md mx-auto">
            <PDFViewer url={pdfUrl} />
        </div>
    );
}