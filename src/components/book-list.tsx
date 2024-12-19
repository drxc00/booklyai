"use client";

import { generatedSinceWhen } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { InfiniteSlider } from "./ui/infinite-slider";

interface BookListProps {
    books: BookDocument[];
    direction: string
}

const BookCard = ({ book, className }: { book: BookDocument, className?: string }) => {
    return (
        <Card className={`text-primary-foreground bg-background border-muted-foreground/80 cursor-pointer ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <p className="text-sm">Topic Prompt: {book.topicPrompt}</p>
                <p className="text-sm">Target Audience: {book.audiencePrompt}</p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
                Created {generatedSinceWhen(new Date(book.createdAt as Date))} ago
            </CardFooter>
        </Card>
    )
};

export default function BookList({ books, direction }: BookListProps) {
    // The direction prop is passed from the page (server-side) and used to decide layout

    return (
        <div className=" items-center">
            {/* Conditionally render based on direction */}
            {direction === "horizontal" ? (
                <InfiniteSlider direction="horizontal" className="flex gap-4 whitespace-nowrap">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </InfiniteSlider>
            ) : (
                <InfiniteSlider direction="vertical" className="flex flex-col gap-4 max-w-full lg:max-h-lvh">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} className="w-full max-w-lg" />
                    ))}
                </InfiniteSlider>
            )}
        </div>
    );
}
