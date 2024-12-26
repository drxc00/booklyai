import { Button } from "@/components/ui/button"
import { BookIcon } from 'lucide-react'
import BackgroundGrid from "./background-grid"
import Link from "next/link"

export default function Pricing() {
    return (
        <BackgroundGrid>
            <section className="w-full py-12 md:py-24 lg:py-32 items-center justify-center">
                <div className="px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Affordable Ebook Creation
                        </h2>
                        <p className="max-w-[700px] text-muted-foreground">
                            Transform your ideas into well crafted ebooks
                        </p>
                    </div>
                    <div className="mx-auto max-w-sm mt-8">
                        <div className="rounded-xl border border-muted p-8 bg-card">
                            <h3 className="font-serif text-2xl font-bold text-center mb-4">Generate Your Ebooks</h3>
                            <div className="text-center mb-4">
                                <span className="text-5xl font-bold">$1</span>
                                <span className="text-muted-foreground">/ebook</span>
                            </div>
                            <Link href="/dashboard/generate">
                                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 mb-6">
                                    <BookIcon className="mr-2 h-5 w-5" />
                                    Start Generating
                                </Button>
                            </Link>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Powered by GPT-4o
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Fast and efficient
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Easy to use
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </BackgroundGrid>
    )
}

