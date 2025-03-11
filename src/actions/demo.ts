"use server";
import { promises as fs } from "fs";
import { utapi } from "./uploadthing";
import parsePdf from "pdf-parse";

export const getFile = async (key: string) => {
  // Get the file URL from uploadthing
  const oneUrl = await utapi.getFileUrls(key);
  const fileData = oneUrl.data[0];
  console.log("File data:", fileData);

  try {
    // Fetch the PDF file from the URL
    const response = await fetch(fileData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Convert the response to an array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create temp directory if it doesn't exist
    const tempDir = "temp";
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    const tempFilePath = `./temp/${key}.pdf`;
    await fs.writeFile(tempFilePath, buffer);

    // Parse the PDF using pdf-parse
    const data = await parsePdf(buffer);
    const parsedText = data.text;

    // Clean up
    await fs.unlink(tempFilePath);

    return parsedText;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
};
