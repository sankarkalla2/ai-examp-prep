// app/actions.js
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { PDFDocument } from 'pdf-lib';

export async function uploadAndParsePDF(formData: FormData) {
  try {
    // Get the file from the FormData
    const file = formData.get('pdf') as File;
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    // Create a temp file to store the uploaded PDF
    const tempDir = os.tmpdir();
    console.log(tempDir);
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.pdf`);
    
    // Convert file to buffer and save to temp file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(buffer)
    await fs.writeFile(tempFilePath, buffer);
    
    // Parse the PDF
    const pdfContent = await parsePDF(buffer);
    
    // Delete the temp file
    await fs.unlink(tempFilePath);
    
    return pdfContent;
  } catch (error:any) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF: ' + error.message);
  }
}

async function parsePDF(pdfBuffer:Buffer) {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    // We'll use pdf-parse for text extraction
    // Since we're in a server action, we can use dynamic import
    const pdfParse = (await import('pdf-parse')).default;
    
    const data = await pdfParse(pdfBuffer);
    
    // Format the extracted text with page numbers
    // Note: This is approximate as pdf-parse gives all text at once
    const textPerPage = Math.ceil(data.text.length / totalPages);
    let allText = '';
    
    for (let i = 0; i < totalPages; i++) {
      const startChar = i * textPerPage;
      const endChar = Math.min((i + 1) * textPerPage, data.text.length);
      const pageText = data.text.substring(startChar, endChar);
      
      allText += `Page ${i + 1}:\n${pageText}\n\n`;
    }
    
    return allText;
  } catch (error:any) {
    console.error('Error parsing PDF:', error);
    throw new Error('PDF parsing failed: ' + error.message);
  }
}