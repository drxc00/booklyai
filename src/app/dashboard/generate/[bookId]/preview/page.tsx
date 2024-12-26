

import React from "react";
import PDFViewer from "@/components/pdf-viewer";
import { auth } from "@/lib/auth";
import { createPresignedUrl, getBookData } from "@/app/actions";
import PurchaseButton from "@/components/purchase-button";
import { Session } from "next-auth";
import ForbiddenAccess from "@/components/forbidden-access";

export default async function PreviewPage({ params }: { params: Promise<{ bookId: string }> }) {
    // Extract `bookId` from params
    const { bookId } = await params;
    const [session, url, book] = await Promise.all([
        auth(),
        createPresignedUrl(String(bookId), "preview"),
        getBookData(String(bookId))
    ]);

    // Check if book belongs to user
    if (book?.userId !== session?.user?.id) {
        return <ForbiddenAccess />
    }

    // Render the preview
    return (
        <div className="grid items-center justify-items-center">
            <div className="grid grid-cols-1 text-center mt-10 lg:grid-cols-2 lg:text-start lg:mt-0 gap-8 items-center">
                <div className="gap-2 max-w-lg">
                    <p className="text-3xl font-semibold font-serif">Your book preview is ready!</p>
                    <p className="text-muted-foreground">Review the preview and, when you&apos;re satisfied, take the next step to finish and bring your book to life.</p>
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
