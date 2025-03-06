
import React from "react";
import { Tags, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionItem from "./SectionItem";

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
    return <div className="text-center py-6">جاري التحميل...</div>;
  }

  if (filteredSections.length === 0) {
    return (
      <div className="text-center py-12">
        <Tags className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">لا توجد أقسام بعد</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          أضف أقسام لتنظيم عرض منتجاتك وتسهيل تصفحها للعملاء
        </p>
        <Button 
          className="mt-4 gap-2"
          onClick={() => {
            setNewSection("قسم جديد");
            setNewSectionType("best_selling");
            openAddDialog();
          }}
        >
          <Plus className="h-4 w-4" />
          <span>إضافة أول قسم</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredSections.map(section => (
        <SectionItem
          key={section.id}
          section={section}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          handleUpdateSection={handleUpdateSection}
          handleDeleteSection={handleDeleteSection}
        />
      ))}
    </div>
  );
};

export default SectionList;
