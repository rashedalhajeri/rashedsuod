
import React, { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionItem from "./SectionItem";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Section } from "@/services/section-service";

interface SectionListProps {
  sections: Section[];
  loading: boolean;
  searchQuery: string;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => void;
  setNewSection: (name: string) => void;
  setNewSectionType: (type: string) => void;
  openAddDialog: () => void;
  handleReorderSections?: (reorderedSections: Section[]) => void;
}

const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading,
  searchQuery,
  editingSection,
  setEditingSection,
  handleUpdateSection,
  handleDeleteSection,
  setNewSection,
  setNewSectionType,
  openAddDialog,
  handleReorderSections
}) => {
  // Filter sections by search query
  const filteredSections = sections.filter(
    section => section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onDragEnd = (result: any) => {
    if (!result.destination || !handleReorderSections) return;
    
    const reorderedSections = Array.from(filteredSections);
    const [removed] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, removed);
    
    // Update sort order based on new positions
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      sort_order: index
    }));
    
    handleReorderSections(updatedSections);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-muted-foreground">جاري تحميل الأقسام...</p>
        </div>
      </div>
    );
  }

  if (filteredSections.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mb-4">
          <LayoutGrid className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium">لا توجد أقسام بعد</h3>
        <p className="mt-2 text-muted-foreground max-w-md">
          الأقسام تساعدك على تنظيم عرض منتجاتك في متجرك وتعرض المنتجات للعملاء بشكل منظم وجذاب
        </p>
        <Button 
          className="mt-6 gap-2 bg-primary hover:bg-primary/90"
          onClick={() => {
            setNewSection("قسم جديد");
            setNewSectionType("best_selling");
            openAddDialog();
          }}
        >
          <span>إنشاء أول قسم</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {filteredSections.map((section, index) => (
              <Draggable 
                key={section.id} 
                draggableId={section.id} 
                index={index}
                isDragDisabled={!handleReorderSections}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                  >
                    <SectionItem
                      section={section}
                      editingSection={editingSection}
                      setEditingSection={setEditingSection}
                      handleUpdateSection={handleUpdateSection}
                      handleDeleteSection={handleDeleteSection}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SectionList;
