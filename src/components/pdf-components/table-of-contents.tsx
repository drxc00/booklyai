

import { styles, tableOfContentsStyles } from "@/lib/react-pdf-styles";
import { View, Text, Page } from "@react-pdf/renderer";

export default function PDFTableOfContents({
    chapterInfo
}: {
    chapterInfo: {
        title: string;
        chapters: { title: string; subchapters: { title: string }[] }[]
    }
}) {
    return (
        <Page size="LETTER" style={styles.body}>
            <View>
                <Text style={tableOfContentsStyles.mainChapterTitle}>Table of Contents</Text>
                {/* Map over chapters */}
                {chapterInfo.chapters.map((chapter, index) => (
                    <View key={index} style={tableOfContentsStyles.chapterContainer}>
                        {/* Main chapter */}
                        <View style={tableOfContentsStyles.row}>
                            <Text style={tableOfContentsStyles.chapterIndex}>{index + 1}.</Text>
                            <Text style={tableOfContentsStyles.chapterTitle}>{chapter.title}</Text>
                        </View>

                        {/* Subchapters */}
                        {chapter.subchapters.map((subChapter, subIndex) => (
                            <View key={subIndex} style={tableOfContentsStyles.subchapterRow}>
                                <Text style={tableOfContentsStyles.subchapterIndex}>
                                    {index + 1}.{subIndex + 1}.
                                </Text>
                                <Text style={tableOfContentsStyles.subchapterTitle}>
                                    {subChapter.title}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
    );
}
