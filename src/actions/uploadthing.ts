import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  // ...options,
  token: process.env.UPLOADTHING_SECRET,
});
