"use client";
import { bookGenerator, generateBookPreview, getBookData } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { use, useCallback, useEffect, useState } from "react";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { iterateStreamResponse } from "@/lib/utils";
import ErrorMessage from "@/components/error-message";

export default function FinalPage({ params }: { params: Promise<{ bookId: string }> }): React.ReactNode {
    // Extract `bookId` from params
    const { bookId } = use(params);
    const router = useRouter();

    // State Handlers
    const [progress, setProgress] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Handle Generate callback
    const handleGenerate = useCallback(async () => {
        try {
            // Iterate over the value of the bookGenerator
            for await (const value of iterateStreamResponse(bookGenerator(bookId))) {
                setProgress(`Generating chapter "${value}"`);
            }
            // Redirect the user to the final book page
            router.replace(`/dashboard/book/${bookId}`);
        } catch (error) {
            console.error(error)
        }
    }, []);

    // Query for fetching book data
    const { data: bookData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["book", bookId],
        placeholderData: null, // Set placeholderData to null
        queryFn: async () => await getBookData(bookId), // Invoke the getBookData server action to fetch data
        // Disable any excessive fetching requests.
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        cacheTime: 60000,
    });

    // Use Effect to handle book Generation upon mount
    useEffect(() => {
        // Check if the book data is loaded.
        // This is is use to prevent the useEffect from running before the book data is loaded.
        if (isLoading || !bookData) return;
        const generateFinal = async () => {
            // Set the 'isGenerating' state to true to trigger a loading screen
            setIsGenerating(true);
            // Set an initial progress message
            setProgress("Generating chapters...");
            // Invoke the handleGenerate callback that generates the chapters
            await handleGenerate();
        }
        // Trigger the generation
        generateFinal();
    }, []); // Note that we have an empty dependency array, this means that the useEffect will only run once.
    // If the book is purchased, we redirect the user to the book.
    if (bookData && bookData.isPurchased) {
        router.push(`/dashboard/book/${bookId}`);
        return;
    }
    // Render an Error Screen when 'isError' state is true
    if (isError) {
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <ErrorMessage>
                <p className="text-2xl">{"Something went wrong"}</p>
            </ErrorMessage>
        </div>
    }
    // Render a Loading Screen when 'isLoading' state is true
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader message="Loading" />
            </div>
        )
    }
    // Render a Loading Screen when 'isGenerating' state is true
    if (isGenerating) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader message={progress as string} />
            </div>
        );
    }
    // Render the generation process
    return (
        <div className="items-center justify-items-center mt-8 gap-16">
            <div>
                <Button onClick={() => generateBookPreview(bookId as string)}>Continue Generating</Button>
            </div>
        </div>
    );
}