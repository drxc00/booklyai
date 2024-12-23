
const PDFViewer = ({ url }: { url: string }) => {
    return (
        <div className="mt-8 flex flex-col items-center justify-center w-full">
            <div className="w-full border p-2 bg-muted rounded-md mb-4 flex gap-2 items-center justify-center">
                <embed src={url as string} type="application/pdf" width="100%" height="600px" />
            </div>
        </div>
    );
};
export default PDFViewer;
