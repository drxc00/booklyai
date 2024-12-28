import { CheckCircle, Dot, Download, Eye, LucideCircleX } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { generatedSinceWhen } from "@/lib/utils";
import Link from "next/link";


export default function MyCollections({ books }: { books: BookDocument[] }) {
    return (
        <>
            {books.map((book) => (
                <Card
                    key={book.id}
                    className="w-full bg-card shadow-none cursor-pointer">
                    <CardContent className="pt-6 h-full flex flex-col justify-between gap-3">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 font-serif">{book.title}</h3>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <p className="text-sm flex items-center">{book.isPurchased ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle size={15} />
                                    <span>Purchased</span>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LucideCircleX size={15} />
                                    <span>Not Purchased</span>
                                </span>
                            )}</p>
                            <Dot />
                            <p className="text-sm">{generatedSinceWhen(new Date(book.createdAt as Date))} ago</p>

                        </div>

                        <Link href={book.isPurchased ? `/dashboard/book/${book.id}` : `/dashboard/generate/${book.id}/preview`}>
                            <Button variant={book.isPurchased ? "default" : "outline"} 
                                className="w-full bg-secondary-foreground hover:bg-secondary/5">
                                {book.isPurchased ? (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Download
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        Preview
                                    </>
                                )}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}