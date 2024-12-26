'use client';

import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DownloadPDFProps {
    presignedUrl: string;
    fileName?: string;
}

export default function DownloadPDF({ presignedUrl, fileName }: DownloadPDFProps) {
    const [downloading, setDownloading] = React.useState(false);
    const handleDownload = async () => {
        setDownloading(true);
        try {
            const response = await fetch(presignedUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch the file.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'file.pdf';
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file:', error);
            toast({
                variant: 'destructive',
                title: 'Error downloading the file',
                description: 'Please try again later.'
            })
        }
        setDownloading(false);
    };

    return (
        <Button className="w-full" onClick={handleDownload} disabled={downloading}>
            <Download className="mr-2" />
            <a href={presignedUrl as string}>Download</a>
        </Button>
    );
};

