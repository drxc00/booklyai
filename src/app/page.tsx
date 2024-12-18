import BookList from "@/components/book-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBooks } from "./actions";
import { unstable_cache as cache } from "next/cache";
import { TextLoop } from "@/components/ui/text-loop";
import { Badge } from "@/components/ui/badge";
import { AiOutlineOpenAI } from "react-icons/ai";
import cachedSession from "@/lib/session-cache";
import LogOutButton from "@/components/(auth-components)/log-out";
import { MdCollectionsBookmark, MdOutlineLogout } from "react-icons/md";
import { Session } from "next-auth";

// Apply Caching to prevent excessive Vercel Functions Cost
const getBooksLatest = cache(async () => await getBooks(20),
  ['latestBooks'],
  { revalidate: 3600, tags: ["latestBooks"] }
);

export default async function Home() {
  // Fetch both the cached session and the latest books
  const [session, booksLatest] = await Promise.all([
    cachedSession(),
    getBooksLatest()
  ]) as [Session, BookDocument[]];

  return (
    <div className="grid justify-items-center max-w-full">
      <main className="min-h-screen">
        <div className="flex flex-col-reverse lg:flex-row lg:items-center gap-16">
          <div className="hidden lg:block">
            <BookList books={booksLatest} direction="vertical" />
          </div>
          <div className="block  lg:hidden w-lvw">
            <BookList books={booksLatest} direction="horizontal" />
          </div>
          <div className="flex flex-col w-full max-w-4xl items-center text-center lg:items-start lg:text-left lg:p-0 lg:mt-0 mt-40">
            <div className="mb-5 ga-2">
              <Badge className="bg-muted border-muted-foreground hover:bg-muted mb-2">
                <AiOutlineOpenAI size={20} />
                <span className="ml-1">Powered by gpt-4o</span>
              </Badge>
              <div className="scroll-m-20 text-4xl tracking-normal lg:text-4xl flex gap-2 justify-center lg:justify-start">
                <div>Generate ebooks for <span className="font-bold w-48 items-center">
                  <TextLoop interval={2}>
                    <span>learning</span>
                    <span>knowledge</span>
                    <span>creativity</span>
                  </TextLoop>
                </span> </div>

              </div>
              <p className="mt-2 text-muted-foreground text-xl lg:p-0"><span className="font-bold">booklyai</span>: An AI powered ebook generator that actually works</p>
            </div>

            <div className="flex gap-3">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button className="text-md">
                      <span>Go to Dashboard </span> <MdCollectionsBookmark />
                    </Button>
                  </Link>
                  <LogOutButton className="text-md" variant="secondary"> <span>Log Out</span> <MdOutlineLogout /> </LogOutButton>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="text-md">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/learn-more">
                    <Button className="text-md" variant="secondary">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
