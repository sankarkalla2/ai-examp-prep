import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}
const AuthLayout = async ({ children }: Props) => {
  const session = await auth();
  if (session?.user) return redirect("/");
  return <>{children}</>;
};

export default AuthLayout;
