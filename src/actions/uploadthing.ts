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
  subjectId?: string
) {
  const session = await auth();
  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user?.id,
    },
    include: {
      subjects: true,
    },
  });

  if (!user) return null;

  //WIP: check subscription & files management.

  const files = pdfData.map((pdf) => pdf.file);
  const response = await utapi.uploadFiles(files);
  if (!subjectId) {
    const newSubject = await db.subject.create({
      data: {
        title: "Untitle 1",
        type: type,
        name: "unititlj2j",
        userId: user?.id,
        SubjectFile: {
          create: response.map((file) => ({
            fileKey: file.data?.key ?? "",
          })),
        },
      },
    });

    return newSubject.id;
  }

  return null;
}
