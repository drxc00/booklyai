
const PDFViewer = ({ url }: { url: string }) => {
    return (
        <div className="lg:mt-8 flex flex-col items-center justify-center w-full lg:p-0 p-4">
            <div className="w-full border p-2 bg-card shadow rounded-md mb-4 flex gap-2 items-center justify-center">
                {/* <iframe src={url as string}  className="w-full h-[calc(100vh-12rem)]"/> */}
                <object data={url} type="application/pdf" className="w-full h-[calc(100vh-12rem)]">
                    <p className="text-center">This browser does not support PDFs. Please download the PDF to view it</p>
                </object>
            </div>
        </div>
    );
};
export default PDFViewer;
