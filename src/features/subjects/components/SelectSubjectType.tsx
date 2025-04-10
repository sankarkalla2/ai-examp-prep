import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SubjectType } from "@prisma/client";
interface SelectSubjectTypeProps {
  handleUploadTypeSelect: React.Dispatch<
    React.SetStateAction<SubjectType | null>
  >;
}
const SelectSubjectType = ({
  handleUploadTypeSelect,
}: SelectSubjectTypeProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={() => handleUploadTypeSelect(SubjectType.SYLLABUS)}
        className="gap-1.5"
        size="lg"
      >
        <FileText className="h-4 w-4" />
        Upload Syllabus
      </Button>
      <Button
        onClick={() => handleUploadTypeSelect(SubjectType.MATERIALS)}
        className="gap-1.5"
        size="lg"
      >
        <FileText className="h-4 w-4" />
        Upload Materials
      </Button>
    </div>
  );
};

export default SelectSubjectType;
