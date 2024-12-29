import { BookOpen, CheckCircle, Dot, LucideCircleX, PenLine, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { generatedSinceWhen } from "@/lib/utils";
import Link from "next/link";
import { deleteBook } from "@/app/actions";
import { AlertDialog, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";


export default function MyCollections({ books }: { books: BookDocument[] }) {
    return (
        <>
            {books.map((book) => (
                <Card
                    key={book.id}
                    className="w-full cursor-pointer">
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
                        {book.isPurchased ? (
                            <Link href={`/dashboard/book/${book.id}`}>
                                <Button variant="default" className="w-full">
                                    <BookOpen className="w-4 h-4" />
                                    Preview
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex gap-2">
                                <Link href={`/dashboard/generate/${book.id}/preview`} className="w-full">
                                    <Button variant="outline" className="w-full bg-card hover:bg-card/90">
                                        <PenLine className="w-4 h-4" />
                                        Finalize
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-bold font-serif">Delete Book?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-muted-foreground">
                                                Are you sure you want to delete this book?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={
                                                async () => {
                                                    "use server";
                                                    await deleteBook(book.id as string);
                                                }
                                            }>
                                                <Button variant="destructive" type="submit">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    );
}