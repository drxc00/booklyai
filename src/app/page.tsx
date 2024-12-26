
import { getBooks } from "./actions";
import { unstable_cache as cache } from "next/cache";
import cachedSession from "@/lib/session-cache";
import { Session } from "next-auth";
import HeroSection from "@/components/hero-section";
import RecentBooksSection from "@/components/recent-books";
import Pricing from "@/components/pricing-section";

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
    <main className="place-content-center min-h-screen">
      <HeroSection isLoggedIn={!!session} />
      <RecentBooksSection recentBooks={booksLatest} />
      <Pricing />
    </main>
  );
}
