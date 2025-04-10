import { PDFData } from "@/lib/pdf-utils";
import { Subject, SubjectType } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { createSubject } from "../server/create-subject";
import { useRouter } from "next/navigation";

export const useCreateSubject = () => {
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionStarted, setExtractionStarted] = useState(false);
  const [uploadType, setUploadType] = useState<SubjectType | null>(null);
  const router = useRouter();

  const handleFilesSelect = (files: File[]) => {
    const newPdfs = files.map((file, index) => ({
      id: uuidv4(),
      file,
      order: index,
      fileName: file.name,
      text: null,
      metadata: null,
      status: "pending" as const,
    }));

    // Add new PDFs to the list
    setPdfs((current) => [...current, ...newPdfs]);
    toast.info(
      `Added ${files.length} PDF${files.length !== 1 ? "s" : ""} to the queue`
    );
  };

  const handleRemovePdf = (pdfId: string) => {
    setPdfs((current) => current.filter((pdf) => pdf.id !== pdfId));
  };

  const handleReorderPdfs = (updatedPdfs: PDFData[]) => {
    setPdfs(updatedPdfs);
  };

  const handleUpload = async () => {
    if (!extractionStarted) {
      setExtractionStarted(true);
      toast.info("Started processing PDF files");
    }

    if (!uploadType) {
      toast.error("Please select a subject type");
      return;
    }

    setIsProcessing(true);
    console.log("uploading files", pdfs);

    const res = await createSubject(pdfs, uploadType);
    if (res.status === 200) {
      toast.success("Subject created successfully");
      return router.push(`/subjects/${res.subjectId}`);
    } else {
      toast.error(res.message);
    }
  };

  return {
    pdfs,
    setPdfs,
    isProcessing,
    setIsProcessing,
    extractionStarted,
    setExtractionStarted,
    uploadType,
    setUploadType,
    handleFilesSelect,
    handleRemovePdf,
    handleReorderPdfs,
    handleUpload,
  };
};
