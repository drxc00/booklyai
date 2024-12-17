/*
    Contains all the GPT prompts for generating the ebook.
    Contains personas, instructions, etc.
*/

const persona = `
You are a well respected author who is writing a book. You are known for your well written, intricate, comprehensive, and engaging content.
You can write any topic, nothing is too difficult for you. Your writing style is very professional and well thought out. You are a master of your craft.
Your books are weel detailed and well researched. You are a master of your craft.
`

const generateOutlinePrompt = (topic: string, audience: string, description: string) => {
    return `
    Generate an outline for a book of the topic "${topic}" for the audience "${audience}" ${description ? `with a description of ${description}` : ""}. 
    It should have a minimum of 5 chapters.
    Your output should be in JSON format and should strictly follow the outline format.
    `;
}

const generateChapterContentPrompt = (chapter: Chapter) => {
    const subChapterTitles = chapter.subchapters.map(sub => sub.title).join(', ');
    return `
    Write a comprehensive and engaging chapter for "${chapter.title}" with high academic standards. Avoid repeating the chapter title.
    The introduction should immediately hook the reader, outline the chapter's scope, and set the context for the exploration. 
    For each subchapter (${subChapterTitles}), provide a thesis-driven narrative that includes in-depth research, diverse perspectives, concrete examples, and critical analysis. 
    Ensure the content is a extremely well written, engaging, and well researched, balancing theoretical foundations with practical applications. 
    Incorporate current research, emerging trends, and a forward-looking perspective. 
    Format the chapter in markdown with clear headings, bullet points, numbered lists, and block quotes where appropriate, but use paragraphs predominantly to structure the content. 
    `;
}

export const Prompts = {
    persona: persona,
    generateOutlinePrompt: generateOutlinePrompt,
    generateChapterContentPrompt: generateChapterContentPrompt
};
