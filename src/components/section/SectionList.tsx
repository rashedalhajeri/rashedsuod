
import React from "react";
import { Tags, Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionItem from "./SectionItem";
import { motion } from "framer-motion";

interface Section {
  id: string;
  name: string;
  sort_order: number;
  section_type: string;
  is_active: boolean;
}

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
  openAddDialog
}) => {
  // Filter sections by search query
  const filteredSections = sections.filter(
    section => section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Plus className="h-4 w-4" />
          <span>إنشاء أول قسم</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredSections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <SectionItem
            section={section}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            handleUpdateSection={handleUpdateSection}
            handleDeleteSection={handleDeleteSection}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SectionList;
