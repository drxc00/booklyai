import { LibraryIcon, Sparkles } from 'lucide-react'
import { SiOpenai } from "react-icons/si";
import { Button } from './ui/button'
import Link from 'next/link'
import BackgroundGrid from './background-grid'
export default function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <BackgroundGrid>
            <section className="py-12 md:py-24 lg:py-32 xl:py-48">
                <div className="px-4 md:px-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-primary-foreground bg-muted px-4 py-1.5 cursor-pointer">
                            <SiOpenai className="h-4 w-4 text-primary-foreground" />
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
                        <div className="flex flex-col gap-2 md:flex-row lg:flex-row ">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/dashboard/generate">
                                        <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                                            <Sparkles className="h-5 w-5" />
                                            Generate
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard">
                                        <Button variant="outline" size="lg" className="w-full bg-secondary-foreground hover:bg-secondary-foreground/90 border-muted">
                                            <LibraryIcon className="h-5 w-5" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Link href="/login" className="w-full">
                                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                                        <Sparkles className="h-5 w-5" />
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section >
        </BackgroundGrid>
    )
}