import { Text, View, Font } from '@react-pdf/renderer';
import { markdownStyles } from '@/lib/react-pdf-styles';
import React from 'react';
import Html from 'react-pdf-html';
import { MarkdownToHTML } from '@/lib/utils';

export default function PDFMarkdownParser({ children }: { children: string }) {

    // Invoke the markdown to HTML helper function
    const mdHtml = MarkdownToHTML(children);
    return (
        <View wrap={true} style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
        >
            <Html
                style={{ width: '100%' }}
                stylesheet={markdownStyles}
                renderers={{
                    View: ({ children, ...props }) => <View {...props} break>{children}</View>,
                    Text: ({ children, ...props }) => <Text {...props} break={true}>{children}</Text>,
                }}

            >
                {mdHtml}
            </Html>
        </View>
    )
}

Font.registerHyphenationCallback((word) => {
    return [word];
});
