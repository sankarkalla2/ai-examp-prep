import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { db } from "./lib/db";
import { SubscriptionPlan } from "@prisma/client";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;

        const existingUser = await db.user.findFirst({
          where: {
            id: user.id,
          },
          include: {
            Subscription: true,
          },
        });

        if (existingUser && !existingUser.Subscription) {
          await db.user.update({
            where: {
              id: user.id,
            },
            data: {
              Subscription: {
                create: {
                  plan: SubscriptionPlan.FREE,
                },
              },
            },
          });
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
