import { clsx, type ClassValue } from "clsx";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { twMerge } from "tailwind-merge";

// Flag to determine if we are in production
export const ENVIRONMENT: "production" | "development" | "test" = "development";

// Constant messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: "Authentication failed. Please log in.",
  NO_CHAPTER_DATA: "No chapter data found",
};

export const MESSAGES = {
  BUILDING_PDF: "Building the PDF file",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function MarkdownToHTML(markdownContent: string): string {
  // Convert markdown to HTML
  const rawHtml = remark()
    .use(remarkHtml) // Use the remark-html plugin to convert to HTML
    .processSync(markdownContent) // Process the markdown
    .toString(); // Convert the AST to raw HTML string
  return rawHtml
}

export function generatedSinceWhen(createdAt: Date): string {
  // Calculate the days since the book was generated
  const now = new Date();
  // Calculate the minutes since the book was generated
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60);
  // Calculate the hours since the book was generated
  const inHours = Math.floor(diffInMinutes / 60);
  // Conditionally check if the hours exceeds a day
  if (inHours > 24) {
    // Calculate the days since the book was generated
    const days = Math.floor(inHours / 24);
    // We then return an appropriate string based on the number of days
    return days > 1 ? `${days} days` : `${days} day`;
  }
  // Default case, we return a string in hours.
  return inHours > 1 && inHours < 24 ? `${inHours} hours` : `${inHours} hour`;
}

// Helper function to iterate over a stream response
// This is used in the client to iterate over a stream response
export function iterateStreamResponse<T>(streamResponse: Promise<StreamResponseChunk<T>>) {
  return {
    [Symbol.asyncIterator]: function () {
      return {
        current: streamResponse,
        async next() {
          const { iteratorResult, next } = await this.current

          if (next) this.current = next
          else iteratorResult.done = true

          return iteratorResult
        }
      };
    }
  };
}
