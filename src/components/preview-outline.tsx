import { Book, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export default function PreviewOutline({ bookData }: { bookData: BookDocument}) {

    const totalChapters = bookData.chapters.length
    const totalSubChapters = bookData.chapters.reduce((total, chapter: Chapter) => total + (chapter.subchapters ? chapter.subchapters.length : 0), 0);
    const chapters = bookData.chapters

    return (
        <div>
            <Card className="w-full max-w-lg mx-auto shadow-none border-muted-foreground bg-background">
                <CardHeader>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-center">{bookData.title}</CardTitle>
                        <div className="flex gap-2 justify-center">
                            <Badge variant="secondary">
                                {totalChapters} Chapters
                            </Badge>
                            <Badge variant="outline" className="bg-muted">
                                {totalSubChapters} Subchapters
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] rounded-md border-muted-foreground border p-4">
                        <ul className="space-y-4">
                            {chapters.map((chapter, index) => (
                                <li key={index} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                        <Book className="w-4 h-4 mt-1 text-foreground" />
                                        <span className="font-semibold">
                                            Chapter {index + 1}: {chapter.title}
                                        </span>
                                    </div>
                                    {chapter.subchapters && chapter.subchapters.length > 0 && (
                                        <ul className="pl-6 space-y-1">
                                            {chapter.subchapters.map((subChapter, subIndex) => (
                                                <li key={subIndex} className="flex items-start gap-2">
                                                    <ChevronRight className="w-3 h-3 mt-1 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {index + 1} {subIndex + 1}. {subChapter.title}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </CardContent>
            </Card>


            {/* <h2>Book Title: {bookData.title}</h2>
            <h2>Chapters:</h2>
            {bookData.chapters.map((chapter, cidx) => (
                <div className="text-sm" key={cidx}>
                    <Collapsible>
                        <CollapsibleTrigger className="font-bold flex justify-between w-full">
                            <span className="flex gap-2 items-center">
                                {cidx + 1}. {(chapter as Chapter).title}
                                {isGeneratingPreview && cidx === 0 && (
                                    <LoaderIcon className="animate-spin h-4 w-4 shrink-0 opacity-50" />
                                )}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="ml-3 max-w-sm">
                            {(chapter as Chapter).subchapters.map((subchapter, scidx) => (
                                <p key={scidx} className="font-base flex gap-2 items-center">
                                    {cidx + 1}.{scidx + 1}. {subchapter.title}
                                </p>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            ))} */}
        </div>
    )
}