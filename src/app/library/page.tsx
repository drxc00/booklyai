export const dynamic = "force-dynamic";

import MyCollections from "@/components/my-collections";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { getUserBooks } from "../actions";
import { CircleOff } from "lucide-react";
import getCachedSession from "@/lib/session-cache";
import { Session } from "next-auth";

export default async function DashboardPage() {
    // Fetch books of the user
    const books: BookDocument[] = await getUserBooks() as BookDocument[];
    const session = await getCachedSession();
    return (
        <main>
            <div className="grid items-center p-10">
                <div className="flex flex-col lg:flex-row w-full md:flex-row gap-4 justify-center text-center lg:text-start lg:justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold font-serif tracking-normal lg:text-4xl md:text-3xl text-2xl text-primary-foreground">
                            My Books
                        </h1>
                        <p className="text-muted-foreground">You have {books.length} books in your library</p>
                    </div>
                    <Link href="/generate">
                        <Button className="text-md" >
                            <HiSparkles size={40} />
                            <span className="font-medium">Generate</span>
                        </Button>
                    </Link>
                </div>
                <Separator className="my-4" />
                {books.length !== 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MyCollections books={books} session={session as Session} />
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