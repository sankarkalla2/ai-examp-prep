"use client";

import { getFile } from "@/actions/demo";
import { UploadButton } from "@/lib/uploadthing";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={async (res) => {
          // Do something with the response
          console.log("Files: ", res);
          console.log("File: ", res[0].key);
          const file = await getFile(res[0].key);

          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}



