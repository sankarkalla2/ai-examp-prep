"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PDFData } from "@/lib/pdf-utils";
import { uploadFiles } from "@/server/uploadthing";
import { SubjectType } from "@prisma/client";

export const createSubject = async (
  pdfs: PDFData[],
  uploadType: SubjectType
) => {
  const session = await auth();
  if (!session?.user?.id)
    return { status: 401, message: "You are Unauthorized!." };

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Subscription: true,
    },
  });
  if (!user || !user.Subscription)
    return { status: 401, message: "You are Unauthorized!." };

  const { Subscription } = user;
  //WIP: check subscription & files management.

  const subjectId = await uploadFiles(pdfs, uploadType, user.id);

  if (!subjectId) return { status: 400, message: "Failed to create subject!." };

  return { status: 200, message: "Subject created successfully!.", subjectId };
};
