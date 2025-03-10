
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Save, X, GripHorizontal, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import { Draggable } from "react-beautiful-dnd";
import { Section } from "@/services/section-service";

interface SectionItemProps {
  section: Section;
  index: number;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => Promise<void>;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  index,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDeleteClick = async () => {
    try {
      await handleDeleteSection(section.id);
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف القسم "${section.name}" بنجاح`
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting section:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم حذف القسم، يرجى المحاولة مرة أخرى"
      });
    }
  };
  
  // Determine the section type display text
  const getSectionTypeText = (type: string) => {
    switch (type) {
      case "best_selling":
        return "الأكثر مبيعاً";
      case "featured":
        return "منتجات مميزة";
      case "newest":
        return "أحدث المنتجات";
      case "category":
        return "منتجات من فئة";
      case "custom":
        return "منتجات مخصصة";
      default:
        return "غير محدد";
    }
  };

  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided) => (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-sm mb-2 transition-all"
          ref={provided.innerRef}
          {...provided.draggableProps}
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
              <div className="flex items-center flex-1">
                <div {...provided.dragHandleProps} className="cursor-grab mr-2 text-gray-400 hover:text-gray-600">
                  <GripHorizontal size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium">{section.name}</span>
                  <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                      {getSectionTypeText(section.type)}
                    </span>
                    <span className="flex items-center gap-1">
                      {section.display_style === 'grid' ? (
                        <><LayoutGrid size={12} /> عرض شبكي</>
                      ) : (
                        <><List size={12} /> عرض قائمة</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
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
              <>
                <p>هل أنت متأكد من رغبتك في حذف القسم:</p>
                <p className="font-bold mt-1 text-black">{section.name}؟</p>
                <p className="mt-2 text-sm">سيتم حذف جميع المعلومات المرتبطة بهذا القسم.</p>
              </>
            }
            onDelete={() => handleDeleteClick()}
            itemName={section.name}
            itemType="قسم"
          />
        </motion.div>
      )}
    </Draggable>
  );
};

export default SectionItem;
