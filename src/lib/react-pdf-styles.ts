import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
    family: 'Open Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' }
    ]
});

export const styles = StyleSheet.create({
    body: {
        padding: 65,
        fontFamily: 'Open Sans',
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: 'Open Sans',
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    paragraphText: {
        textIndentation: 25,
        fontSize: 16,
        textAlign: 'justify',
        fontFamily: 'Open Sans',
    },
    chapterTitle: {
        marginBottom: 12,
        fontSize: 25,
        fontWeight: 600,
        textAlign: 'center',
        fontFamily: 'Open Sans',
    },
    subChapterTitle: {
        marginBottom: 12,
        fontSize: 18,
        fontWeight: 600,
        textAlign: 'left',
        fontFamily: 'Open Sans',
    },
    text: {
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Open Sans',
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'Open Sans',
        color: 'grey',
    },
});

export const tableOfContentsStyles = StyleSheet.create({
    body: {
        paddingTop: 55,
        paddingBottom: 75,
        paddingHorizontal: 50,
        fontFamily: 'Open Sans',
    },
    mainChapterTitle: {
        fontSize: 25,
        fontWeight: 600,
        paddingBottom: 12,
        textAlign: 'center',
        flexShrink: 1,
        fontFamily: 'Open Sans',
    },
    chapterTitle: {
        fontSize: 18,
        fontWeight: 600,
        marginBottom: 10,
        textAlign: 'left',
        flexShrink: 1,
        fontFamily: 'Open Sans',
    },
    chapterContainer: {
        marginVertical: 5,
        paddingRight: 50,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    chapterIndex: {
        fontSize: 18,
        fontWeight: 600,
        marginRight: 5,
    },
    subchapterRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    subchapterIndex: {
        fontSize: 16,
        fontWeight: 600,
        marginRight: 5,
    },
    subchapterTitle: {
        fontSize: 16,
        flexShrink: 1,
        fontFamily: 'Open Sans',
    },
});

export const markdownStyles = StyleSheet.create({
    body: {
        fontFamily: 'Open Sans',
        margin: 0,
        gap: 10
    },
    h1: {
        fontSize: 20,
        fontWeight: 600,
        margin: 0,
        marginBottom: 10,
    },
    h2: {
        fontSize: 18,
        fontWeight: 600,
        margin: 0,
        marginTop: 12,
        marginBottom: 10,
    },
    h3: {
        fontSize: 16,
        fontWeight: 600,
        margin: 0,
        marginTop: 12,
        marginBottom: 10,
    },
    h4: {
        fontSize: 14,
        fontWeight: 600,
        margin: 0,
        marginTop: 12,
        marginBottom: 10,
    },
    h5: {
        fontSize: 12,
        fontWeight: 600,
        margin: 0,
        marginTop: 12,
        marginBottom: 10,
    },
    h6: {
        fontSize: 10,
        fontWeight: 600,
        margin: 0,
        marginTop: 12,
        marginBottom: 10,
    },
    p: {
        fontSize: 16,
        textIndent: 25,
        textAlign: 'justify',
        margin: 0,
        marginBottom: 12,
    },
    ul: {
        fontSize: 16,
        gap: 5,
        margin: 0,
        marginBottom: 12,
    },
    ol: {
        fontSize: 16,
        gap: 5,
        margin: 0,
        marginBottom: 12,
    },
    li: {
        fontSize: 16,
    },
    code: {
        fontFamily: 'Courier',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
        color: '#d14',
    },
    pre: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginBottom: 12,
        fontSize: 14,
        color: '#d14',
    },
    link: {
        color: '#3498db',
        textDecoration: 'underline',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
        borderRadius: 5,
    },
    blockquote: {
        borderLeft: '4px solid #ccc',
        paddingLeft: 10,
        fontStyle: 'italic',
        marginBottom: 10,
        fontSize: 16,
        color: '#666',
    },
    hr: {
        borderBottom: '1px solid #ccc',
        width: '100%',
    },
    listText: {
        fontSize: 16,
        marginRight: 14,
    },
    checkedBullet: {
        marginRight: 10,
        color: 'green',
    },
    uncheckedBullet: {
        marginRight: 10,
        color: 'red',
    },
    div: {
        alignItems: 'flex-start',
        textAlign: 'justify',
    },
});
