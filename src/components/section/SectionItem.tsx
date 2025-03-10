import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Save, X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { sectionTypes } from "./form/section-config";
import { Section } from "@/services/section-service";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface SectionItemProps {
  section: Section;
  index: number;
  totalSections: number;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => Promise<void>;
  handleReorderSections: (sourceIndex: number, destinationIndex: number) => void;
  dragHandleProps?: any;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  totalSections,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection,
  handleReorderSections,
  dragHandleProps
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Find the section type object for this section
  const sectionTypeObj = sectionTypes.find(type => type.id === section.section_type);

  // Control reordering
  const handleMoveUp = () => {
    if (index > 0) {
      handleReorderSections(index, index - 1);
    }
  };

  const handleMoveDown = () => {
    if (index < totalSections - 1) {
      handleReorderSections(index, index + 1);
    }
  };
  
  const handleDeleteClick = async () => {
    try {
      await handleDeleteSection(section.id);
      toast(`تم حذف القسم "${section.name}" بنجاح`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting section:", error);
      toast(`لم يتم حذف القسم، يرجى المحاولة مرة أخرى`, {
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-sm transition-all"
    >
      <div className="hidden sm:flex items-center mr-2 text-gray-400" {...dragHandleProps}>
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex items-center flex-1">
        {editingSection?.id === section.id ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              value={editingSection.name}
              onChange={(e) =>
                setEditingSection({ ...editingSection, name: e.target.value })
              }
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
        ) : (
          <>
            <div className="flex items-center">
              {sectionTypeObj && (
                <div className={`h-10 w-10 mr-3 rounded-lg bg-${sectionTypeObj.color}-50 flex items-center justify-center`}>
                  <div className={`text-${sectionTypeObj.color}-500`}>
                    {sectionTypeObj.icon}
                  </div>
                </div>
              )}
              <div>
                <span className="text-lg font-medium block">{section.name}</span>
                <span className="text-xs text-gray-500">
                  {sectionTypeObj?.description || 'قسم مخصص'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col sm:flex-row gap-1 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-9 p-0"
                  onClick={handleMoveUp}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>نقل للأعلى</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 w-9 p-0"
                  onClick={handleMoveDown}
                  disabled={index === totalSections - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>نقل للأسفل</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

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
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="تأكيد حذف القسم"
        description={
          <div className="text-center">
            <p>هل أنت متأكد من رغبتك في حذف القسم:</p>
            <p className="font-bold mt-1 text-black">{section.name}؟</p>
            <p className="mt-2 text-sm">سيتم إخفاء هذا القسم من متجرك.</p>
          </div>
        }
        onDelete={() => handleDeleteClick()}
        itemName={section.name}
        itemType="قسم"
      />
    </motion.div>
  );
};

export default SectionItem;
