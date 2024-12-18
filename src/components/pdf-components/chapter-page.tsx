import { Page, View, Text } from "@react-pdf/renderer";
import { styles } from '@/lib/react-pdf-styles';
import PDFMarkdownParser from "./markdown-parser";

export default function PDFChapterPage({ chapterInfo }: { chapterInfo: BookChapter }) {
    return (
        <Page size="LETTER" style={styles.body} dpi={300}>
            <View >
                <Text style={styles.chapterTitle}>{chapterInfo.title}</Text>
                <Text style={styles.paragraphText}>{chapterInfo.introduction}</Text>

                {chapterInfo.subchapters.map((subChapter, index) => (
                    <View key={index} break>
                        <Text style={styles.subChapterTitle}>{subChapter.title}</Text>
                        {/* <Text style={styles.paragraphText}>{subChapter.content}</Text> */}
                        <View>
                            <PDFMarkdownParser children={subChapter.content as string} />
                        </View>
                    </View>
                ))
                }
                <Text style={[styles.paragraphText]} break>{chapterInfo.conclusion}</Text>
            </View>
            <View style={styles.pageNumber} fixed>
                <Text render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} />
            </View>
        </Page>
    );
}