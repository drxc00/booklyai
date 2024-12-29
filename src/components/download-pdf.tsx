'use client';

import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DownloadPDFProps {
    presignedUrl: string;
    fileName?: string;
}

interface Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName?: string) => boolean;
}

interface Window {
    MSStream?: any;
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
            const userAgent = navigator.userAgent || navigator.vendor;

            // Detect Device/Platform
            const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as Window).MSStream;
            const isAndroid = /Android/.test(userAgent);
            const isMobile = /Mobi/.test(userAgent);

            if (isIOS || isAndroid || isMobile) {
                // Fallback for Mobile Devices (iOS/Android)
                const reader = new FileReader();
                reader.onloadend = () => {
                    const url = reader.result as string;
                    window.open(url, '_blank'); // Open in a new tab
                };
                reader.readAsDataURL(blob);
            } else if ((window.navigator as Navigator).msSaveOrOpenBlob) {
                // Fallback for IE/Edge Legacy
                (window.navigator as Navigator).msSaveOrOpenBlob?.(blob, fileName || 'file.pdf');
            } else {
                // Standard Download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName || 'file.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading the file:', error);
            toast({
                variant: 'destructive',
                title: 'Error downloading the file',
                description: 'Please try again later.',
            });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button className="w-full" onClick={handleDownload} disabled={downloading}>
            <Download className="mr-2" />
            Download
        </Button>
    );
};