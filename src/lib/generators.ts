import openai from "./openai";
import { Prompts } from "./prompts";


export async function generateBookOutline(
    booktopic: string, 
    targetaudience: string, 
    bookdescription: string
) : Promise<string | null> {
    
    // Construct the prompt to generate the outline
    const outlinePrompt = Prompts.generateOutlinePrompt(booktopic, targetaudience, bookdescription);
    
    // Invokes the OpenAI API to generate the outline
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: Prompts.persona }, // Set The Persona Of the Model
            { role: "user", content: outlinePrompt } // Set The Prompt
        ],
        // We enable response formatting, specifically the JSON schema format
        // The schema defines the structure of the response
        // We detine properties and their respective types, as well as descriptions-
        // -to provide context to the llm.
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "book_outline_schema",
                schema: {
                    type: "object",
                    properties: {
                        booktitle: {
                            type: "string",
                            description: "The title of the book"
                        },
                        chapters: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "The title of the chapter"
                                    },
                                    subchapters: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                title: {
                                                    type: "string",
                                                    description: "The title of the subchapter"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    // Extract the outline from the response and return as a string.
    return completion.choices[0].message.content as string;
}