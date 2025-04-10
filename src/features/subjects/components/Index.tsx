"use client";
import React from "react";
import FileUploadZone from "@/components/FileUploadZone";
import PDFProcessingList from "./PDFProcessingList";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import SelectSubjectType from "./SelectSubjectType";
import { SubjectType } from "@prisma/client";
import { useCreateSubject } from "../hooks/use-create-subject";

const Index = () => {
  const {
    pdfs,
    isProcessing,
    extractionStarted,
    uploadType,
    handleFilesSelect,
    handleRemovePdf,
    handleReorderPdfs,
    handleUpload,
    setUploadType,
  } = useCreateSubject();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10 animate-fade-in">
                <h1 className="text-4xl font-medium tracking-tight mb-3">
                  Extract Text from PDF Documents
                </h1>
                <p className="text-xl text-muted-foreground">
                  Fast, free, and secure PDF text extraction right in your
                  browser
                </p>
              </div>

              <div className="space-y-6 animate-fade-in">
                {!uploadType ? (
                  <SelectSubjectType handleUploadTypeSelect={setUploadType} />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Upload{" "}
                        {uploadType === SubjectType.SYLLABUS
                          ? "Syllabus"
                          : "Materials"}
                      </h2>
                      <Button
                        variant="ghost"
                        onClick={() => setUploadType(null)}
                      >
                        Change Type
                      </Button>
                    </div>
                    <FileUploadZone
                      onFilesSelect={handleFilesSelect}
                      isLoading={isProcessing}
                      isMultiple={uploadType === SubjectType.MATERIALS}
                    />
                  </>
                )}

                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Supported format: PDF (.pdf) • Multiple files supported • Drag
                  to reorder
                </p>

                {pdfs.length > 0 && (
                  <>
                    <PDFProcessingList
                      pdfs={pdfs}
                      onRemove={handleRemovePdf}
                      onReorder={handleReorderPdfs}
                      isProcessing={isProcessing}
                    />

                    {!extractionStarted && (
                      <div className="flex justify-center mt-4">
                        <Button onClick={handleUpload} className="gap-1.5">
                          <FileText className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
