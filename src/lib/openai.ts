import OpenAI from "openai";

// Openai singleton instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default openai;