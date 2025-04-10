import * as pdfjs from "pdfjs-dist";

// Set worker source path
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export interface PDFData {
  id: string;
  file: File;
  fileName: string;
  text: string | null;
  metadata: any | null;
  status: "pending" | "processing" | "completed" | "error";
  error?: string;
}

/**
 * Extract text content from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Get the total number of pages
    const numPages = pdf.numPages;
    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");

      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

/**
 * Get PDF metadata
 */
export async function getPDFMetadata(file: File): Promise<any> {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    // Get the metadata
    const metadata = await pdf.getMetadata();

    return {
      ...metadata.info,
      numPages: pdf.numPages,
    };
  } catch (error) {
    console.error("Error getting PDF metadata:", error);
    throw new Error("Failed to get PDF metadata");
  }
}

/**
 * Process a PDF file to extract text and metadata
 */
export async function processPDF(pdfData: PDFData): Promise<PDFData> {
  try {
    // Extract text and metadata in parallel
    const [text, metadata] = await Promise.all([
      extractTextFromPDF(pdfData.file),
      getPDFMetadata(pdfData.file),
    ]);

    return {
      ...pdfData,
      text,
      metadata,
      status: "completed",
    };
  } catch (error) {
    console.error(`Error processing PDF ${pdfData.fileName}:`, error);
    return {
      ...pdfData,
      status: "error",
      error: "Failed to process PDF",
    };
  }
}
