import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FilesIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface FileUploadZoneProps {
  onFilesSelect: (files: File[]) => void;
  isLoading?: boolean;
  isMultiple?: boolean;
}

const FileUploadZone = ({
  onFilesSelect,
  isLoading = false,
  isMultiple = true,
}: FileUploadZoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const pdfFiles = acceptedFiles.filter(
        (file) => file.type === "application/pdf"
      );
      if (pdfFiles.length > 0) {
        onFilesSelect(pdfFiles);
      }
    },
    [onFilesSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      multiple: isMultiple,
      disabled: isLoading,
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out",
        "flex flex-col items-center justify-center p-6 cursor-pointer",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-primary/50 hover:bg-muted/50",
        isDragReject && "border-destructive bg-destructive/5",
        isLoading && "opacity-60 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />

      <div className="animate-fade-in flex flex-col items-center gap-4 text-center">
        {isDragActive ? (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FilesIcon className="h-6 w-6 text-primary animate-pulse" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-1">
          <p className="font-medium text-sm">
            {isDragActive
              ? "Drop the PDF files here"
              : isLoading
              ? "Processing..."
              : "Drag & drop your PDF files here"}
          </p>
          <p className="text-sm text-muted-foreground">
            {!isDragActive && !isLoading && "or click to browse files"}
          </p>
        </div>

        {!isLoading && !isDragActive && (
          <Button variant="secondary" size="sm" className="mt-2">
            Select PDFs
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;
