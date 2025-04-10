"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getSubjectById = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id)
    return { status: 401, message: "You are unauthrized" };

  const subject = await db.subject.findUnique({
    where: {
      userId: session.user.id,
      id,
    },
    include: {
      SubjectFile: true,
    },
  });

  return subject;
};

export const getAllSubjectByUserID = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id)
    return { status: 401, message: "You are unauthrized" };

  const subjects = await db.subject.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return { status: 200, data: subjects };
};
