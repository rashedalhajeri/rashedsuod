
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Edit, Trash, Save, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/services/section-service";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import { toast } from "@/hooks/use-toast";

interface SectionItemProps {
  section: Section;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => Promise<void>;
  index: number;
  totalSections: number;
  handleReorderSections?: (sourceIndex: number, destinationIndex: number) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const getSectionTypeLabel = (type: string) => {
  switch (type) {
    case "featured": return "المنتجات المميزة";
    case "best_selling": return "الأكثر مبيعاً";
    case "new_arrivals": return "وصل حديثاً";
    case "all_products": return "جميع المنتجات";
    case "category": return "فئة محددة";
    case "custom": return "تخصيص يدوي";
    default: return type;
  }
};

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection,
  index,
  totalSections,
  handleReorderSections,
  dragHandleProps
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isDraggable = !!dragHandleProps && !!handleReorderSections;
  
  const handleMoveUp = () => {
    if (handleReorderSections && index > 0) {
      handleReorderSections(index, index - 1);
    }
  };
  
  const handleMoveDown = () => {
    if (handleReorderSections && index < totalSections - 1) {
      handleReorderSections(index, index + 1);
    }
  };
  
  const handleDeleteClick = async () => {
    try {
      await handleDeleteSection(section.id);
      toast({
        description: `تم حذف القسم "${section.name}" بنجاح`
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        description: "لم يتم حذف القسم، يرجى المحاولة مرة أخرى",
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
      {editingSection?.id === section.id ? (
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
      ) : (
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
          <div className="flex gap-2">
            {handleReorderSections && (
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
        </>
      )}
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="تأكيد حذف القسم"
        description={
          <div className="text-center">
            <p>هل أنت متأكد من رغبتك في حذف القسم:</p>
            <p className="font-bold mt-1 text-black">{section.name}؟</p>
            <p className="mt-2 text-sm">سيتم حذف جميع المعلومات المرتبطة بهذا القسم.</p>
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
