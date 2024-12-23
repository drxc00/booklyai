

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