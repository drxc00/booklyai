export const dynamic = "force-dynamic";

import MyCollections from "@/components/my-collections";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { getUserBooks } from "../actions";
import { CircleOff } from "lucide-react";

export default async function DashboardPage() {
    // Fetch books of the user
    const books: BookDocument[] = await getUserBooks() as BookDocument[];
    return (
        <main>
            <div className="grid items-center p-10">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold font-serif tracking-normal lg:text-4xl md:text-3xl text-xl text-primary-foreground ">My Books ({books.length})</h1>
                    <Link href="/dashboard/generate">
                        <Button className="text-md">
                            <HiSparkles size={40} />
                            <span className="font-medium">Generate</span>
                        </Button>
                    </Link>
                </div>
                <Separator className="my-4" />
                {books.length !== 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MyCollections books={books} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-foreground mt-10">
                        <CircleOff size={40} />
                        <h1 className=" text-2xl font-semibold mt-4 font-serif">No books found!</h1>
                        <p>You haven&apos;t generated any book yet</p>
                    </div>
                )}
            </div>
        </main>
    )
}