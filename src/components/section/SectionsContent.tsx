
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import SectionList from "./SectionList";
import { Section } from "@/services/section-service";

interface SectionsContentProps {
  sections: Section[];
  loading: boolean;
  searchQuery: string;
  editingSection: Section | null;
  setEditingSection: (section: Section | null) => void;
  handleUpdateSection: () => void;
  handleDeleteSection: (id: string) => Promise<void>;
  setNewSection: (name: string) => void;
  setNewSectionType: (type: string) => void;
  openAddDialog: () => void;
  handleReorderSections?: (reorderedSections: Section[]) => void;
}

const SectionsContent: React.FC<SectionsContentProps> = ({
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
  handleReorderSections,
}) => {
  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-primary" />
          قائمة الأقسام
          <span className="text-sm text-gray-500 font-normal mr-2">(يمكنك سحب الأقسام لتغيير ترتيبها)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6">
        <SectionList
          sections={sections}
          loading={loading}
          searchQuery={searchQuery}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          handleUpdateSection={handleUpdateSection}
          handleDeleteSection={handleDeleteSection}
          setNewSection={setNewSection}
          setNewSectionType={setNewSectionType}
          openAddDialog={openAddDialog}
          handleReorderSections={handleReorderSections}
        />
      </CardContent>
    </Card>
  );
};

export default SectionsContent;
