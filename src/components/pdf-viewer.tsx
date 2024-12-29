
const PDFViewer = ({ url }: { url: string }) => {
    return (
        <div className="mt-8 flex flex-col items-center justify-center w-full">
            <div className="w-full border p-2 bg-card shadow rounded-md mb-4 flex gap-2 items-center justify-center">
                <iframe src={url as string}  className="w-full h-[calc(100vh-12rem)]"/>
            </div>
        </div>
    );
};
export default PDFViewer;
