import { BookOpen, CheckCircle, ClockIcon, Dot, LucideCircleX, PenLine, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { generatedSinceWhen } from "@/lib/utils";
import Link from "next/link";
import PurchaseButton from "./purchase-button";
import { Session } from "next-auth";


export default function MyCollections({ books, session }: { books: BookDocument[], session?: Session }) {
    return (
        <>
            {books.map((book) => (
                <Card
                    key={book.id}
                    className="w-full cursor-pointer shadow-md">
                    <CardHeader>
                        <CardTitle className="font-semibold text-primary-foreground text-lg mb-2 line-clamp-1 font-serif">{book.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            <div className="flex gap-2 justify-between w-full">
                                <p className="text-sm flex items-center">{book.isPurchased ? (
                                    <span className="flex items-center gap-2 text-green-500">
                                        <CheckCircle size={15} />
                                        <span>Purchased</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-destructive">
                                        <LucideCircleX size={15} />
                                        <span>Purchased</span>
                                    </span>
                                )}</p>

                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ClockIcon className="h-4 w-4" />
                                    <span>{generatedSinceWhen(new Date(book.createdAt as Date))} ago</span>
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex gap-2 pt-2 border-t bg-background rounded-b-lg">
                        <div className="mt-4 w-full" >
                            {book.isPurchased ? (
                                <Link href={`/book/${book.id}`}>
                                    <Button variant="default" className="w-full">
                                        <BookOpen className="w-4 h-4" />
                                        Preview
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href={`/generate/${book.id}`} className="w-full">
                                        <Button className="w-full">
                                            <BookOpen className="w-4 h-4" />
                                            Preview
                                        </Button>
                                    </Link>
                                    <div className="w-full">
                                        <PurchaseButton bookId={book.id as string} session={session as Session} variant="secondary" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}