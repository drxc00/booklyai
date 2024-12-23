"use client";

import { getBookData, getS3Link } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { cache, use, useEffect, useState } from "react";
import PreviewOutline from "@/components/preview-outline";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import PDFViewer from "@/components/pdf-components/pdf-viewer";
import { MdOutlinePayment } from "react-icons/md";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function PreviewPage({ params }: { params: Promise<{ bookId: string }> }) {
    // Extract `bookId` from params
    const { bookId } = use(params);
    const router = useRouter();
    const session = useSession();

    // State handlers
    const [s3Link, setS3Link] = useState<string | null>(null);
    const [isPaymentTriggered, setIsPaymentTriggered] = useState(false);

    // Query for fetching book data
    const { data: bookData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["book", bookId],
        queryFn: async () => await getBookData(bookId),
        refetchOnWindowFocus: false,
    });

    // Mutation for generating preview
    const { mutate: invokeGeneratePreview, isLoading: isGeneratingPreview, isError: isPreviewError } = useMutation({
        mutationFn: async () => {
            try {
                const reponse = await fetch("/api/generate/preview", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bookId: bookId }),
                });

                if (!reponse.ok) throw new Error("Error generating preview");

            } catch (error) {
                console.error("Error generating preview:", error);
                throw error;
            }
        },
        onSuccess: () => {
            refetch(); // Refresh the book data after preview generation
        },
        onError: (err) => {
            console.error("Error generating preview:", err);
        },
    });

    // Side effect on mount
    useEffect(() => {
        // redirect user to main book page if book is purchased
        if (bookData && bookData.isPurchased) {
            router.push(`/dashboard/book/${bookId}`);
            return;
        }

        // Function to fetch the S3 link
        const fetchS3Link = async () => {
            const s3Link = await getS3Link(bookId, "preview");
            setS3Link(s3Link);
        };

        // If preview is generated, fetch the S3 link
        if (bookData?.isPreviewGenerated) {
            fetchS3Link();
        }
    }, [bookData]);

    // Handle loading, error, or empty state
    if (isLoading) return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><Loader message="Loading" /></div>;
    if (isError) return <div>Error: {error as string}</div>;
    if (!bookData) return <div>Book not found</div>;

    // render generating page when preview is not generated
    if (isGeneratingPreview) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader message="Generating Preview" />
            </div>
        );
    }

    // Render the preview
    if (bookData && bookData.isPreviewGenerated && s3Link) {
        return (
            <div className="grid items-center justify-items-center">
                <div className="grid grid-cols-1 text-center mt-10 lg:grid-cols-2 lg:text-start lg:mt-0 gap-8 items-center">
                    <div className="gap-2 max-w-lg">
                        <p className="text-2xl font-semibold">Your book preview is ready!</p>
                        <p>Review the preview and, when you're satisfied, take the next step to finish and bring your book to life.</p>
                        <div className="mt-4">
                            <Button
                                disabled={isPaymentTriggered}
                                onClick={async () => {
                                    setIsPaymentTriggered(true);
                                    try {
                                        const response = await axios.post("/api/payments/purchase", {
                                            bookId: bookId,
                                            userId: session.data?.user?.id,
                                            email: session.data?.user?.email,
                                        });

                                        if (response.status !== 200) {
                                            toast({
                                                variant: "destructive",
                                                title: "Error",
                                                description: "Error while making payment",
                                            });
                                            return;
                                        }

                                        const responseJSON = response.data;

                                        router.push(responseJSON.checkoutUrl);
                                    } catch (error) {
                                        toast({
                                            variant: "destructive",
                                            title: "Error",
                                            description: "Error while making payment",
                                        });
                                        setIsPaymentTriggered(false);
                                    }
                                }}>
                                {isPaymentTriggered ? "Redirecting..." : "Purchase Book"} <MdOutlinePayment />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full max-w-xl">
                        <PDFViewer bookId={bookId} type="preview" />
                    </div>
                </div>
            </div>
        );
    }
    // Render the generation process
    if (bookData && !bookData.isPreviewGenerated)
        return (
            <div className="items-center text-center lg:text-start justify-items-center mt-8 gap-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="gap-2 max-w-lg">
                        <p className="text-2xl font-semibold">
                            Here's a sneak peek at your book's outline!
                        </p>
                        <p>
                            Review the structure and make sure everything aligns with your vision.
                        </p>
                        <div className="flex gap-2 items-center mt-4 justify-center lg:justify-start">
                            <Button
                                onClick={() => invokeGeneratePreview()}
                                disabled={isGeneratingPreview}
                            >
                                {isGeneratingPreview ? "Generating..." : "Generate Preview"}
                            </Button>
                            <Button variant="secondary">
                                Regenerate Outline
                            </Button>
                        </div>
                    </div>
                    <div>
                        <PreviewOutline bookData={{
                            ...bookData,
                            previewContent: bookData.previewContent as BookChapter,
                            chapters: bookData.chapters as Chapter[],
                        }} />
                    </div>
                </div>
            </div>
        );
}
