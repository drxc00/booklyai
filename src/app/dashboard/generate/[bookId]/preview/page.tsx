
import { Button } from "@/components/ui/button";
import React from "react";
import PDFViewer from "@/components/pdf-viewer";
import { MdOutlinePayment } from "react-icons/md";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createPresignedUrl, getBookData } from "@/app/actions";
import PurchaseButton from "@/components/purchase-button";
import { Session } from "next-auth";

export default async function PreviewPage({ params }: { params: Promise<{ bookId: string }> }) {
    // Extract `bookId` from params
    const { bookId } = await params;
    const [session, url] = await Promise.all([auth(), createPresignedUrl(String(bookId), "preview")]);

    // Render the preview
    return (
        <div className="grid items-center justify-items-center">
            <div className="grid grid-cols-1 text-center mt-10 lg:grid-cols-2 lg:text-start lg:mt-0 gap-8 items-center">
                <div className="gap-2 max-w-lg">
                    <p className="text-2xl font-semibold">Your book preview is ready!</p>
                    <p>Review the preview and, when you're satisfied, take the next step to finish and bring your book to life.</p>
                    <div className="mt-4">
                        <PurchaseButton bookId={bookId} session={session as Session} />
                    </div>
                </div>
                <div className="w-full max-w-xl">
                    <PDFViewer url={url as string} />
                </div>
            </div>
        </div>
    );
}
