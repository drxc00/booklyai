import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpenIcon, Users2Icon, CalendarIcon, ClockIcon } from 'lucide-react'
import { generatedSinceWhen } from "@/lib/utils"
import { InfiniteSlider } from "./ui/infinite-slider"

interface RecentBooksSectionProps {
    recentBooks: BookDocument[]
}

export default function RecentBooksSection({ recentBooks }: RecentBooksSectionProps) {

    return (
        <section className="py-12 md:py-24 lg:py-32 bg-secondary/5 border">
            <div>
                <div className="space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="font-serif text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Fresh Off the <span className="text-primary">Press</span>
                        </h2>
                        <p className="mx-auto text-muted-foreground">
                            Discover the latest ebooks crafted by other users
                        </p>
                    </div>
                </div>
                <div className=" mt-12"
                    style={{
                        maskImage:
                            'linear-gradient(to right, transparent, black 10%, black 95%, transparent)',
                    }}
                >
                    <InfiniteSlider duration={100} direction="horizontal" className="max-w-screen">
                        {recentBooks.map((book, index) => (
                            <Card key={index} className="overflow-hidden bg-background transition-all shadow w-full max-w-md cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="font-serif text-xl line-clamp-2">{book.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <ClockIcon className="mr-2 h-4 w-4" />
                                            Created {generatedSinceWhen(new Date(book.createdAt as Date))} ago
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <BookOpenIcon className="mr-2 h-4 w-4" />
                                            Topic: {book.topicPrompt}
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Users2Icon className="mr-2 h-4 w-4" />
                                            Audience: {book.audiencePrompt}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </InfiniteSlider>
                </div>
            </div>
        </section>
    )
}