"use client";

import { buildPDF, generateBookPreview, generateChapterContent, getBookData } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronDown, LoaderIcon } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import DocumentBuilder from "@/components/pdf-components/document-builder";
import React from "react";
import PreviewOutline from "@/components/preview-outline";
import WaveLoader from "@/components/loader";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

export default function PreviewPage({ params }: { params: Promise<{ bookId: string }> }) {
    // Extract `bookId` from params
    const { bookId } = React.use(params);
    const router = useRouter();

    // Query for fetching book data
    const { data: bookData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["book", bookId],
        queryFn: async () => await getBookData(bookId),
        refetchOnWindowFocus: false,
    });

    // Mutation for generating preview
    const { mutate: generatePreview, isLoading: isGeneratingPreview, isError: isPreviewError } = useMutation({
        mutationFn: async () => {
            if (!bookData?.chapters[0]) throw new Error("No chapter data found");

            // invoke the preview generation
            await generateBookPreview(bookId);

            // also generate the pdf
            await buildPDF(bookId, "preview");
        },
        onSuccess: () => {
            refetch(); // Refresh the book data after preview generation
        },
        onError: (err) => {
            console.error("Error generating preview:", err);
        },
    });

    // State for rendering the PDF viewer
    const [renderPDFViewer, setRenderPDFViewer] = React.useState(false);

    React.useEffect(() => {
        if (bookData && bookData.isPreviewGenerated) {
            setRenderPDFViewer(true);
        }
    }, [bookData]);

    // Handle loading, error, or empty state
    if (isLoading) return <div className="flex items-center justify-center h-[calc(100vh-4rem)]"><Loader message="Loading" /></div>;
    if (isError) return <div>Error: {error as string}</div>;
    if (!bookData) return <div>Book not found</div>;

    // redirect user to main book page if book is purchased
    if (bookData && bookData.isPurchased) {
        router.replace(`/dashboard/book/${bookId}`);
        return;
    }

    // render generating page when preview is not generated
    if (isGeneratingPreview) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader message="Generating Preview" />
            </div>
        );
    }

    // Render the preview
    if (bookData && bookData.isPreviewGenerated) {
        return (
            <div className="grid items-center justify-items-center">
                <div className="grid grid-cols-1 text-center mt-10 lg:grid-cols-2 lg:text-start lg:mt-0 gap-8 items-center">
                    <div className="gap-2 max-w-lg">
                        <p className="text-2xl font-semibold">Your book preview is ready!</p>
                        <p>Review the preview and, when you're satisfied, take the next step to finish and bring your book to life.</p>
                        <Button className="mt-4" onClick={() => { router.push(`/dashboard/generate/${bookId}/final`); }}>
                            <span className="font-bold">Add to Collections</span> ($0.99)
                        </Button>
                    </div>
                    <div className="w-full max-w-xl">
                        {renderPDFViewer ? (
                            <PDFViewer style={{ width: "100%", height: "90vh", margin: "0 auto", }}>
                                <DocumentBuilder
                                    bookData={{
                                        ...bookData,
                                        bookContents: bookData.bookContents as BookChapter[],
                                        chapters: bookData.chapters as Chapter[],
                                    }}
                                />
                            </PDFViewer>
                        ) : (
                            <div className="bg-gray-200 p-4 min-h-[90vh] w-full flex items-center justify-center">
                                <h1>Loading Preview...</h1>
                            </div>
                        )}
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
                                onClick={() => generatePreview()}
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
                            bookContents: bookData.bookContents as BookChapter[],
                            chapters: bookData.chapters as Chapter[],
                        }} />
                    </div>
                </div>
            </div>
        );
}
