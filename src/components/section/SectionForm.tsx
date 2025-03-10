
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { sectionTypes } from "./form/section-config";
import SectionTypeSelector from "./form/SectionTypeSelector";
import SectionNameField from "./form/SectionNameField";
import { motion } from "framer-motion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Section } from "@/services/section-service";

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  newDisplayStyle?: 'grid' | 'list';
  setNewDisplayStyle: (style: 'grid' | 'list') => void;
  // Make these props optional
  newCategoryId?: string | null;
  setNewCategoryId?: (id: string | null) => void;
  newProductIds?: string[] | null;
  setNewProductIds?: (ids: string[] | null) => void;
  isSubmitting?: boolean;
  error?: string | null;
  handleAddSection?: () => Promise<void>;
  existingSections?: Section[]; // Add this new prop
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  newDisplayStyle = 'grid',
  setNewDisplayStyle,
  // We don't use these props in this component, but they're passed from CategoryTabsManager
  newCategoryId,
  setNewCategoryId,
  newProductIds,
  setNewProductIds,
  isSubmitting = false,
  error = null,
  handleAddSection,
  existingSections = [] // Default to empty array
}) => {
  // Update section name when section type changes
  useEffect(() => {
    if (newSectionType) {
      const selectedType = sectionTypes.find(type => type.id === newSectionType);
      if (selectedType) {
        setNewSection(selectedType.name);
      }
    }
  }, [newSectionType, setNewSection]);

  // Get list of section types that already exist
  const existingSectionTypes = existingSections.map(section => section.section_type);

  // Set a valid default section type that isn't already added
  useEffect(() => {
    if (isOpen && existingSectionTypes.includes(newSectionType)) {
      // Find first available section type
      const availableType = sectionTypes.find(type => !existingSectionTypes.includes(type.id));
      if (availableType) {
        setNewSectionType(availableType.id);
      }
    }
  }, [isOpen, existingSectionTypes, newSectionType, setNewSectionType]);

  const handleTypeChange = (type: string) => {
    setNewSectionType(type);
  };

  const handleSubmit = async () => {
    if (handleAddSection) {
      try {
        await handleAddSection();
        onClose(); // Close the dialog after successful submission
      } catch (error) {
        console.error("Error adding section:", error);
        // Dialog stays open if there's an error
      }
    }
  };

  const isSubmitDisabled = isSubmitting || !newSection.trim() || !newSectionType;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[550px] bg-background max-h-[90vh] overflow-hidden p-0 gap-0"
        dir="rtl"
      >
        <DialogHeader className="p-4 md:p-6 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-bold">إضافة قسم جديد</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            الأقسام تظهر في متجرك وتساعدك على تنظيم وعرض المنتجات بشكل جذاب
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-5 overflow-y-auto py-4 px-4 md:px-6 custom-scrollbar">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertTitle>حدث خطأ</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTypeSelector 
              selectedSectionType={newSectionType}
              onTypeChange={handleTypeChange}
              existingSections={existingSections}
            />
          </motion.div>
          
          {newSectionType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SectionNameField 
                name={newSection}
                onNameChange={setNewSection}
                sectionType={newSectionType}
              />
            </motion.div>
          )}
        </div>
        
        <DialogFooter className="p-4 md:p-6 border-t sticky bottom-0 bg-background z-10 flex-row gap-2 justify-between sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span>إلغاء</span>
            </Button>
          </DialogClose>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>جاري الإضافة...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>إضافة القسم</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
