import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Flag to determine if we are in production
export const ENVIRONMENT: "production" | "development" | "test" = "production";

// Constant messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: "Authentication failed. Please log in.",
  NO_CHAPTER_DATA: "No chapter data found",
  NO_BOOK_DATA: "No book data found",
  NO_BOOKS: "No books found",
};

export const MESSAGES = {
  BUILDING_PDF: "Building the PDF file",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatedSinceWhen(createdAt: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / 1000 / 60);
  const inHours = Math.floor(diffInMinutes / 60);

  // Conditionally check if the hours exceeds a day
  if (inHours > 24) {
    // Calculate the days since the book was generated
    const days = Math.floor(inHours / 24);
    return days > 1 ? `${days} days` : `${days} day`;
  }
  // Default case, we return a string in hours.
  return inHours > 1 && inHours < 24 ? `${inHours} hours` : `${inHours} hour`;
}
