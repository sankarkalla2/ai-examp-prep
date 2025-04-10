import React from "react";
import { FileTextIcon, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFData } from "@/lib/pdf-utils";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";

interface PDFProcessingItemProps {
  pdf: PDFData;
  onRemove: (pdfId: string) => void;
}

const PDFProcessingItem = ({ pdf, onRemove }: PDFProcessingItemProps) => {
  return (
    <div
      className={cn(
        "w-full p-4 rounded-lg border flex items-center gap-3 transition-all",
        pdf.status === "error"
          ? "border-destructive/30 bg-destructive/5"
          : "border-border"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          pdf.status === "completed"
            ? "bg-primary/10"
            : pdf.status === "error"
            ? "bg-destructive/10"
            : "bg-secondary"
        )}
      >
        <FileTextIcon
          className={cn(
            "h-5 w-5",
            pdf.status === "completed"
              ? "text-primary"
              : pdf.status === "error"
              ? "text-destructive"
              : "text-muted-foreground"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-sm truncate pr-2" title={pdf.fileName}>
            {pdf.fileName}
          </p>
          <div className="flex items-center">
            {pdf.status === "processing" && (
              <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />
            )}
            {pdf.status === "completed" && (
              <CheckCircle className="h-4 w-4 text-primary mr-2" />
            )}
            {pdf.status === "error" && (
              <XCircle className="h-4 w-4 text-destructive mr-2" />
            )}
          </div>
        </div>

        {pdf.status === "processing" && (
          <Progress value={undefined} className="h-1.5" />
        )}

        {pdf.status === "completed" && pdf.metadata && (
          <p className="text-xs text-muted-foreground">
            {pdf.metadata.numPages}{" "}
            {pdf.metadata.numPages === 1 ? "page" : "pages"}
            {pdf.metadata.Title && ` • ${pdf.metadata.Title}`}
          </p>
        )}

        {pdf.status === "error" && (
          <p className="text-xs text-destructive">
            {pdf.error || "Failed to process PDF"}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {pdf.status === "completed" && (
          <Button variant="outline" size="sm" className="h-8">
            View
          </Button>
        )}
        <Button
          variant={pdf.status === "error" ? "destructive" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => onRemove(pdf.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default PDFProcessingItem;
