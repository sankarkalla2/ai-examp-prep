import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Check, Save, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface ExtractedContentProps {
  content: string;
  metadata: any;
  fileName: string;
  onReset: () => void;
}

const ExtractedContent = ({
  content,
  metadata,
  fileName,
  onReset,
}: ExtractedContentProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Content copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.replace(".pdf", "")}_extracted.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Content downloaded as text file");
  };

  return (
    <Card className="w-full animate-scale-in border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-medium">
              Extracted Content
            </CardTitle>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {metadata.numPages} {metadata.numPages === 1 ? "page" : "pages"}
          </Badge>
        </div>
        {metadata.Title && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {metadata.Title}
          </p>
        )}
      </CardHeader>

      <Separator />

      <Tabs defaultValue="content" className="w-full">
        <div className="px-6 pt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="content"
          className="mt-2 focus-visible:outline-none focus-visible:ring-0"
        >
          <CardContent className="p-4">
            <ScrollArea className="h-[350px] w-full rounded-md border p-4">
              <div className="whitespace-pre-wrap font-mono text-sm">
                {content}
              </div>
            </ScrollArea>
          </CardContent>
        </TabsContent>

        <TabsContent
          value="metadata"
          className="mt-2 focus-visible:outline-none focus-visible:ring-0"
        >
          <CardContent className="p-4">
            <ScrollArea className="h-[350px] w-full rounded-md border p-4">
              <div className="space-y-3">
                {Object.entries(metadata)
                  .filter(([key]) => key !== "numPages")
                  .map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-1">
                      <h4 className="text-sm font-medium">{key}</h4>
                      <p className="text-sm text-muted-foreground">
                        {String(value)}
                      </p>
                      <Separator className="mt-2" />
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between pt-3 pb-6 px-6">
        <Button variant="outline" onClick={onReset}>
          Upload Another
        </Button>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={copyToClipboard}
            className="gap-1.5 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Text
              </>
            )}
          </Button>
          <Button onClick={downloadAsText} className="gap-1.5">
            <Save className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExtractedContent;
