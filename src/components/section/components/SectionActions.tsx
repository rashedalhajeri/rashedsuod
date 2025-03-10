
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Section } from "@/services/section-service";

interface SectionActionsProps {
  section: Section;
  index: number;
  totalSections: number;
  setEditingSection: (section: Section | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  showReorderButtons: boolean;
}

const SectionActions: React.FC<SectionActionsProps> = ({
  section,
  index,
  totalSections,
  setEditingSection,
  setIsDeleteDialogOpen,
  handleMoveUp,
  handleMoveDown,
  showReorderButtons
}) => {
  return (
    <div className="flex items-center gap-2">
      {showReorderButtons && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMoveUp}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تحريك لأعلى</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMoveDown}
                  disabled={index === totalSections - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>تحريك لأسفل</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingSection(section)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>تعديل القسم</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>حذف القسم</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SectionActions;
