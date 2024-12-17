

import { Document, View } from "@react-pdf/renderer";
import PDFTitlePage from "./title-page";
import PDFTableOfContents from "./table-of-contents";
import PDFChapterPage from "./chapter-page";
import { styles } from "@/lib/react-pdf-styles";

export default function DocumentBuilder({ bookData }: { bookData: BookDocument }) : JSX.Element {

    return (
        <Document
            title={bookData.title}
            subject={bookData.topicPrompt}
            creator="booklyai"
            producer="booklyai"
            language="en"
        >
            <PDFTitlePage title={bookData.title} />
            <PDFTableOfContents chapterInfo={
                {
                    title: "Table of Contents",
                    chapters: bookData.chapters as Chapter[],
                }
            } />
            {bookData?.bookContents.map((chapter, index) => (
                <PDFChapterPage key={index} chapterInfo={chapter as BookChapter} />
            ))}
        </Document>
    )
}