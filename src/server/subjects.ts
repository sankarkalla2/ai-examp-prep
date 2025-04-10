"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getSubjectsByUserID = async (id: string) => {
  const session = await auth();
  if (!session?.user?.id)
    return { status: 401, message: "You are unauthrized" };

  const subjects = await db.subject.findMany({
    where: {
      userId: id,
    },
  });

  return subjects;
};
