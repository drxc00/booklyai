

type BookOutline = {
    booktitle: string,
    chapters: Chapter[]
}

type Chapter = {
    title: string,
    subchapters: {
        title: string
        content?: string
    }[]
}

type BookChapter = {
    title: string;
    introduction: string;
    subchapters: {
        title: string;
        content: string;
    }[];
    conclusion: string;
}

type GenerateBookRequest = {
    topic: string,
    audience: string
    description: string
}

type BookDocument = {
    id?: string
    userId?: string
    title: string
    topicPrompt?: string | null | undefined
    audiencePrompt?: string | null | undefined
    descriptionPrompt?: string
    chapters: Chapter[]
    previewContent: BookChapter
    awsFinalId?: string
    awsPreviewId?: string
    isPreviewGenerated?: boolean
    isPurchased?: true | false
    createdAt?: Date
    updatedAt?: Date
}

type StreamResponseChunk<T> = {
    iteratorResult: IteratorResult<T>
    next?: Promise<StreamResponseChunk<T>>
}

interface DotProps {
    /**
     * Color of the dot
     */
    color?: string;

    /**
     * Size of the dot in pixels
     */
    size?: number;

    /**
     * Spacing between dots
     */
    spacing?: number;

    /**
     * Content of the component
     */
    children?: React.ReactNode;

    /**
     * Class name
     */
    className?: string;

    style?: React.CSSProperties;
}