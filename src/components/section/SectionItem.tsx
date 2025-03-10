
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/services/section-service";
import { toast } from "@/hooks/use-toast";
import SectionEditMode from "./components/SectionEditMode";
import SectionDisplayMode from "./components/SectionDisplayMode";
import SectionDeleteDialog from "./components/SectionDeleteDialog";

interface SectionItemProps {
  section: Section;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => Promise<void>;
  index: number;
  totalSections: number;
  handleReorderSections?: (sourceIndex: number, destinationIndex: number) => void;
  dragHandleProps?: any;
}

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
        <SectionEditMode 
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          handleUpdateSection={handleUpdateSection}
        />
      ) : (
        <SectionDisplayMode 
          section={section}
          dragHandleProps={dragHandleProps}
          isDraggable={isDraggable}
          index={index}
          totalSections={totalSections}
          setEditingSection={setEditingSection}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleReorderSections={handleReorderSections}
        />
      )}
      
      <SectionDeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        sectionName={section.name}
        onDelete={handleDeleteClick}
      />
    </motion.div>
  );
};

export default SectionItem;
