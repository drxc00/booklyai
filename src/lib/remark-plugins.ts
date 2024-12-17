
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';

export function remarkPrintRawHTML() {
    return (tree: any) => {
        // Create a processor that converts the tree to HTML
        const html = remark()
            .use(remarkRehype)
            .use(remarkParse)
            .use(remarkHtml) // Use the remark-html plugin to convert to HTML
            .use(remarkGfm) // Use the remark-gfm plugin 
            .stringify(tree); // Convert the AST to raw HTML string
        return html;
    };
}



