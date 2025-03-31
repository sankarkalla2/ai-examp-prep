import { auth, signOut } from "@/auth";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <p>{session?.user?.email}</p>
      <SignOut />
    </div>
  );
}
