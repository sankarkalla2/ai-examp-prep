"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export const getUser = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Subscription: true,
    },
  });

  return user;
};
