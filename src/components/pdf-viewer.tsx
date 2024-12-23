"use client";

import React, { useCallback, useEffect, useState } from 'react';
const PDFViewer = ({ bookId, type }: { bookId: string, type: string }) => {

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the PDF URL from the server
        fetch(`/api/get-pdf?key=${bookId}&type=${type}`)
            .then(response => response.json())
            .then(data => setPdfUrl(data.url))
            .catch(error => console.error('Error fetching PDF URL:', error));
    }, []);


    return (
        <div className="mt-8 flex flex-col items-center justify-center w-full">
            <div className="w-full border p-2 bg-muted rounded-md mb-4 flex gap-2 items-center justify-center">
                {pdfUrl ? (
                    <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                ) : (
                    <div>Loading PDF...</div>
                )}
            </div>
        </div>
    );
};

export default PDFViewer;
