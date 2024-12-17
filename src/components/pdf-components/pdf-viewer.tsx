"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '../ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = ({ url }: { url: string }) => {
    const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    // Use a useCallback to memoize the function
    const fetchPdf = useCallback(async () => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        setPdfData(arrayBuffer);
    }, []);

    // Trigger the fetch function when the component mounts
    useEffect(() => {
        fetchPdf();
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

    return (
        <div className="mt-8 flex flex-col items-center justify-center w-full">
            <div className="border p-2 bg-muted rounded-md mb-4 flex gap-2 items-center justify-center">
                <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>Prev</Button>
                <span>
                    Page {pageNumber} of {numPages}
                </span>
                <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>Next</Button>
            </div>
            {pdfData ? (
                <Document
                    file={pdfData}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className=""
                >
                    <Page pageNumber={pageNumber} className="border" scale={0.8} />
                </Document>
            ) : (
                <div>Loading PDF...</div>
            )}
        </div>
    );
};

export default PDFViewer;
