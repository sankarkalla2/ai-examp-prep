
import { GeneratedQuestions } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanPDFText(text: string): string {
  return (
    text
      // Replace multiple spaces with a single space
      .replace(/\s+/g, " ")

      // Remove ellipsis
      .replace(/\.{3,}/g, "")

      // Remove spaces before punctuation
      .replace(/\s+([.,;!?)])/g, "$1")

      // Add space after punctuation if not followed by space
      .replace(/([.,;!?(])(?!\s)/g, "$1 ")

      // Remove special characters and symbols (keeping essential ones)
      .replace(/[^\w\s.,;!?()\-"']/g, "")

      // Fix common PDF extraction issues
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Fix joined words like "thisIs" to "this Is"

      // Remove repeated newlines
      .replace(/\n{3,}/g, "\n\n")

      // Remove page number markers (common in PDFs)
      .replace(/Page \d+:\n/g, "")

      // Fix hyphenated words across lines
      .replace(/(\w+)-\n(\w+)/g, "$1$2")

      // Trim whitespace
      .trim()
  );
}

// Additional utility functions for specific cleaning tasks
export function removeHeadersFooters(text: string): string {
  // Remove common headers/footers patterns
  return text
    .replace(/^.*(?:Page|Slide) \d+.*$/gm, "") // Remove page numbers
    .replace(/^Copyright.*$/gm, "") // Remove copyright notices
    .replace(/^All rights reserved.*$/gm, ""); // Remove rights statements
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/[\t\f\r ]+/g, " ") // Replace all whitespace with single space
    .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
    .trim();
}

export function cleanEquations(text: string): string {
  return (
    text
      // Preserve common mathematical symbols
      .replace(/[×∙⋅]/g, "*") // Convert multiplication symbols to *
      .replace(/[÷]/g, "/") // Convert division symbol to /
      .replace(/[−]/g, "-") // Convert minus symbol to -
      .replace(/[²³⁴⁵⁶⁷⁸⁹]/g, "^2") // Convert superscript numbers to ^n format
      .replace(/[₁₂₃₄₅₆₇₈₉]/g, "_n") // Convert subscript numbers to _n format
      .replace(/[∑∏∫]/g, "") // Remove complex mathematical symbols
      .trim()
  );
}

// Calculate appropriate question count based on content length
export const calculateQuestionCount = async(
  contentLength: number
): Promise<{ mcqCount: number; inputCount: number }> => {
  // Base scaling factors
  const baseMCQper1000Chars = 0.5; // 1 MCQ per 2000 characters
  const baseInputper1000Chars = 0.1; // 1 input question per 10000 characters

  // Calculate raw counts
  let mcqCount = Math.floor((contentLength / 1000) * baseMCQper1000Chars);
  let inputCount = Math.floor((contentLength / 1000) * baseInputper1000Chars);

  // Apply min/max constraints
  mcqCount = Math.min(Math.max(mcqCount, 5), 1000); // At least 5, at most 1000
  inputCount = Math.min(Math.max(inputCount, 2), 150); // At least 2, at most 150

  return { mcqCount, inputCount };
};

// Validate question quality
export const validateQuestionQuality = async(
  questions: GeneratedQuestions
): Promise<GeneratedQuestions> => {
  // Filter MCQ questions based on quality criteria
  const validatedMCQs = questions.mcqQuestions.filter((q) => {
    // Question should be at least 20 characters
    if (q.question.length < 20) return false;

    // Options should be unique
    const options = [
      q.options.option1,
      q.options.option2,
      q.options.option3,
      q.options.option4,
    ];
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) return false;

    // Answer should match one of the options
    if (!options.includes(q.answer)) return false;

    return true;
  });

  // Filter input questions based on quality criteria
  const validatedInputs = questions.inputQuestions.filter((q) => {
    // Question should be at least 20 characters
    if (q.question.length < 20) return false;

    // Expected format should be provided
    if (q.expectedFormat.length < 5) return false;

    return true;
  });

  return {
    mcqQuestions: validatedMCQs,
    inputQuestions: validatedInputs,
  };
};
