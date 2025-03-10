
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
    <div className="flex gap-2">
      {showReorderButtons && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-9 w-9 rounded-lg"
                  onClick={handleMoveUp}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>نقل لأعلى</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-9 w-9 rounded-lg"
                  onClick={handleMoveDown}
                  disabled={index === totalSections - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>نقل لأسفل</p>
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
              variant="outline"
              className="h-9 w-9 rounded-lg"
              onClick={() => setEditingSection(section)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>تعديل</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="outline"
              className="h-9 w-9 rounded-lg text-destructive hover:text-white hover:bg-destructive border-destructive/20"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>حذف</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SectionActions;
