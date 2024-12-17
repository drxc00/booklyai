

import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { styles } from '@/lib/react-pdf-styles';

export default function PDFTitlePage({ title }: { title: string }) {
    return (
        <Page size="LETTER" style={styles.body}>
            <View style={styles.title}>
                <Text>{title}</Text>
            </View>
        </Page>
    );
}