import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import path from "path";
import os from "os";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(file.arrayBuffer);

    // Create a temp file to store the uploaded PDF
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.pdf`);

    // Convert file to buffer and save to temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFileSync(tempFilePath, buffer);

    // Parse the PDF
    const pdfContent = await parsePDF(buffer);

    // Delete the temp file
    await fs.unlinkSync(tempFilePath);

    return NextResponse.json({ content: pdfContent });
  } catch (error: any) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF: " + error.message },
      { status: 500 }
    );
  }
}

async function parsePDF(pdfBuffer: Buffer) {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // We'll use pdf-parse for text extraction
    const pdfParse = (await import("pdf-parse")).default;

    // Pass the buffer directly to pdfParse, along with any necessary options
    const data = await pdfParse(Buffer.from(pdfBuffer));

    // Format the extracted text with page numbers
    // Note: This is approximate as pdf-parse gives all text at once
    const textPerPage = Math.ceil(data.text.length / totalPages);
    let allText = "";

    for (let i = 0; i < totalPages; i++) {
      const startChar = i * textPerPage;
      const endChar = Math.min((i + 1) * textPerPage, data.text.length);
      const pageText = data.text.substring(startChar, endChar);

      allText += `Page ${i + 1}:\n${pageText}\n\n`;
    }

    return allText;
  } catch (error: any) {
    console.error("Error parsing PDF:", error);
    throw new Error("PDF parsing failed: " + error.message);
  }
}
