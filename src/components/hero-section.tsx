import { BookOpenIcon, LibraryIcon, SparklesIcon } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import BackgroundGrid from './background-grid'
export default function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <BackgroundGrid>
            <section className="py-12 md:py-24 lg:py-32 xl:py-48">
                <div className="px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-primary-foreground bg-secondary/10 px-4 py-1.5">
                            <SparklesIcon className="h-4 w-4 text-primary-foreground" />
                            <span className="text-sm font-medium text-primary-foreground">Powered by GPT-4o</span>
                        </div>
                        <div className="space-y-3 w-full max-w-4xl">
                            <h1 className="font-serif text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                Create Effortlessly. Publish Seamlessly.{" "}
                                <span className="text-primary">Powered by AI.</span>
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground">
                                Turn your ideas into polished ebooks in minutes. Let AI handle the writing, so you can focus on sharing your ideas with the world.</p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Link href="/dashboard/generate">
                                <Button size="lg" className="">
                                    <BookOpenIcon className="mr-2 h-5 w-5" />
                                    Start Generating
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" size="lg" className="bg-secondary-foreground border-muted">
                                    <LibraryIcon className="mr-2 h-5 w-5" />
                                    Browse Library
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section >
        </BackgroundGrid>
    )
}