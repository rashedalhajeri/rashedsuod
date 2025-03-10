
import React, { useState } from 'react';
import SectionsContent from '@/components/section/SectionsContent';
import SectionsHeader from '@/components/section/SectionsHeader';
import { useSections } from '@/hooks/use-sections';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SectionForm from '@/components/section/SectionForm';

const Sections = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    sections,
    loading,
    newSection,
    setNewSection,
    newSectionType,
    setNewSectionType,
    newDisplayStyle,
    setNewDisplayStyle,
    editingSection,
    setEditingSection,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleReorderSections
  } = useSections();

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <SectionsHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddSection={openAddDialog}
      />
      <SectionsContent 
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <SectionForm
            isSubmitting={false}
            formTitle="إضافة قسم جديد"
            submitButtonText="إضافة"
            sectionName={newSection}
            setSectionName={setNewSection}
            sectionType={newSectionType}
            setSectionType={setNewSectionType}
            displayStyle={newDisplayStyle}
            setDisplayStyle={setNewDisplayStyle}
            onSubmit={async () => {
              await handleAddSection();
              closeAddDialog();
            }}
            onCancel={closeAddDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sections;
