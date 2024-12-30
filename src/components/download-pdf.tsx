'use client';

import React from 'react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import fileDownload from 'js-file-download';

interface DownloadPDFProps {
    presignedUrl: string;
    fileName?: string;
}
export default function DownloadPDF({ presignedUrl, fileName }: DownloadPDFProps) {
    const [downloading, setDownloading] = React.useState(false);

    const detectDevice = () => {
        const userAgent = navigator.userAgent || navigator.vendor;

        // iOS detection
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return 'ios';
        }

        // Android detection
        if (/android/i.test(userAgent)) {
            return 'android';
        }

        // Desktop Safari detection
        if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
            return 'safari';
        }

        // Chrome detection
        if (/chrome/i.test(userAgent)) {
            return 'chrome';
        }

        // Firefox detection
        if (/firefox/i.test(userAgent)) {
            return 'firefox';
        }

        // Edge detection
        if (/edg/i.test(userAgent)) {
            return 'edge';
        }

        return 'other';
    };

    const handleDownload = async () => {
        setDownloading(true);
        const device = detectDevice();
        const finalFileName = `${fileName || 'file'}.pdf`;

        try {
            // For iOS and Android
            if (device === 'ios' || device === 'android') {
                // Open in new tab for mobile devices
                window.open(presignedUrl, '_blank');
                toast({
                    title: 'File opened',
                    description: 'Use your browser\'s save/share options to download the file.',
                });
                return;
            }

            // For Safari
            if (device === 'safari') {
                try {
                    // Try fetch and blob approach first
                    const response = await fetch(presignedUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = finalFileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    // Fallback to direct download
                    window.open(presignedUrl, '_blank');
                }
            } else {
                // For Chrome, Firefox, Edge, and others
                const response = await fetch(presignedUrl);
                if (!response.ok) throw new Error('Download failed');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = finalFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

            toast({
                title: 'Download started',
                description: 'Your file should begin downloading shortly.',
            });
        } catch (error) {
            console.error('Error downloading the file:', error);
            // Fallback for any errors
            try {
                window.open(presignedUrl, '_blank');
                toast({
                    title: 'Alternate download method',
                    description: 'The file has been opened in a new tab. Please save it from there.',
                });
            } catch (fallbackError) {
                toast({
                    variant: 'destructive',
                    title: 'Error downloading the file',
                    description: 'Please try again later or contact support.',
                });
            }
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