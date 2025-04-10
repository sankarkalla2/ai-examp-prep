import React from "react";
import { PDFData } from "@/lib/pdf-utils";
import PDFProcessingItem from "./PDFProcessingItem";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface PDFProcessingListProps {
  pdfs: PDFData[];
  onRemove: (pdfId: string) => void;
  onReorder: (updatedPdfs: PDFData[]) => void;
  isProcessing: boolean;
}

const SortablePDFItem = ({
  pdf,
  onRemove,
}: {
  pdf: PDFData;
  onRemove: (pdfId: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pdf.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PDFProcessingItem pdf={pdf} onRemove={onRemove} />
    </div>
  );
};

const PDFProcessingList = ({
  pdfs,
  onRemove,
  onReorder,
  isProcessing,
}: PDFProcessingListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = pdfs.findIndex((pdf) => pdf.id === active.id);
      const newIndex = pdfs.findIndex((pdf) => pdf.id === over.id);

      const updatedPdfs = [...pdfs];
      const [movedItem] = updatedPdfs.splice(oldIndex, 1);
      updatedPdfs.splice(newIndex, 0, movedItem);

      onReorder(updatedPdfs);
    }
  };

  if (pdfs.length === 0) return null;

  return (
    <div className="w-full space-y-3 animate-fade-in">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Your files ({pdfs.length})
      </h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={pdfs.map((pdf) => pdf.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {pdfs.map((pdf) => (
              <SortablePDFItem key={pdf.id} pdf={pdf} onRemove={onRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PDFProcessingList;
