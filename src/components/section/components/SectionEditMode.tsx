
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Section } from "@/services/section-service";

interface SectionEditModeProps {
  editingSection: Section;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
}

const SectionEditMode: React.FC<SectionEditModeProps> = ({
  editingSection,
  setEditingSection,
  handleUpdateSection
}) => {
  return (
    <div className="flex items-center gap-2 flex-1">
      <Input 
        value={editingSection.name}
        onChange={(e) => setEditingSection({...editingSection, name: e.target.value})}
        className="flex-1"
        autoFocus
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="default"
              onClick={handleUpdateSection}
              disabled={!editingSection.name.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>حفظ التغييرات</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setEditingSection(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>إلغاء</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SectionEditMode;
