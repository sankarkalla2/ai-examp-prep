"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PDFData } from "@/lib/pdf-utils";
import { SubjectType } from "@prisma/client";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({
  token: process.env.UPLOADTHING_SECRET,
});

export async function uploadFiles(
  pdfData: PDFData[],
  type: SubjectType,
  userId: string,
  subjectId?: string
) {
  const files = pdfData.map((pdf) => pdf.file);
  const response = await utapi.uploadFiles(files);
  if (!subjectId) {
    const newSubject = await db.subject.create({
      data: {
        title: "Untitle 1",
        type: type,
        name: "unititlj2j",
        userId: userId,
        SubjectFile: {
          create: response.map((file, index) => ({
            fileKey: file.data?.key ?? "",
            order: index + 1,
          })),
        },
      },
    });

    return newSubject.id;
  }

  return null;
}
