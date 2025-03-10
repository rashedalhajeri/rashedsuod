
import React from "react";
import { LayoutGrid, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/services/section-service";
import { getSectionTypeLabel } from "../utils/sectionUtils";
import SectionActions from "./SectionActions";

interface SectionDisplayModeProps {
  section: Section;
  dragHandleProps?: any;
  isDraggable: boolean;
  index: number;
  totalSections: number;
  setEditingSection: (section: Section | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleReorderSections?: (sourceIndex: number, destinationIndex: number) => void;
}

const SectionDisplayMode: React.FC<SectionDisplayModeProps> = ({
  section,
  dragHandleProps,
  isDraggable,
  index,
  totalSections,
  setEditingSection,
  setIsDeleteDialogOpen,
  handleMoveUp,
  handleMoveDown,
  handleReorderSections
}) => {
  return (
    <>
      <div className="flex items-center">
        {isDraggable && (
          <div 
            className="h-10 w-10 flex items-center justify-center text-gray-400 cursor-move hover:text-gray-600" 
            {...dragHandleProps}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}
        <div className="h-10 w-10 mr-3 rounded-lg bg-indigo-50 flex items-center justify-center">
          <LayoutGrid className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <div className="font-medium">{section.name}</div>
          <Badge variant="outline" className="mt-1 text-xs font-normal">
            {getSectionTypeLabel(section.section_type)}
          </Badge>
        </div>
      </div>
      <SectionActions 
        section={section}
        index={index}
        totalSections={totalSections}
        setEditingSection={setEditingSection}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        showReorderButtons={!!handleReorderSections}
      />
    </>
  );
};

export default SectionDisplayMode;
