import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { sectionTypes } from "./form/section-config";
import { useSectionForm } from "./form/useSectionForm";
import SectionTypeSelector from "./form/SectionTypeSelector";
import SectionNameField from "./form/SectionNameField";
import CustomTypeSelector from "./form/CustomTypeSelector";
import CategorySelector from "./form/CategorySelector";
import ProductSelector from "./form/ProductSelector";
import { motion } from "framer-motion";

interface SectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  newSection: string;
  setNewSection: (name: string) => void;
  newSectionType: string;
  setNewSectionType: (type: string) => void;
  newCategoryId: string | null;
  setNewCategoryId: (id: string | null) => void;
  newProductIds: string[] | null;
  setNewProductIds: (ids: string[] | null) => void;
  newDisplayStyle?: 'grid' | 'list';
  setNewDisplayStyle: (style: 'grid' | 'list') => void;
  handleAddSection?: () => Promise<void>;
}

const SectionForm: React.FC<SectionFormProps> = ({
  isOpen,
  onClose,
  newSection,
  setNewSection,
  newSectionType,
  setNewSectionType,
  newCategoryId,
  setNewCategoryId,
  newProductIds,
  setNewProductIds,
  newDisplayStyle = 'grid',
  setNewDisplayStyle,
  handleAddSection
}) => {
  const {
    categories,
    products,
    isLoading,
    selectedProducts,
    selectedSectionType,
    setSelectedSectionType,
    customType,
    handleProductSelect,
    handleTypeChange,
    handleCustomTypeChange
  } = useSectionForm(
    isOpen,
    newSectionType,
    newProductIds,
    newCategoryId,
    setNewCategoryId,
    setNewProductIds
  );

  useEffect(() => {
    if (selectedSectionType) {
      setNewSectionType(selectedSectionType);
      const selectedType = sectionTypes.find(type => type.id === selectedSectionType);
      if (selectedType && selectedType.id !== 'custom') {
        setNewSection(selectedType.name);
      }
    }
  }, [selectedSectionType, setNewSectionType, setNewSection]);

  const renderCustomContent = () => {
    if (selectedSectionType === 'custom') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CustomTypeSelector 
            customType={customType}
            onCustomTypeChange={handleCustomTypeChange}
          />
          
          {customType === 'category' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <CategorySelector 
                categories={categories}
                selectedCategoryId={newCategoryId}
                onCategorySelect={setNewCategoryId}
                isLoading={isLoading}
              />
            </motion.div>
          )}
          
          {customType === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ProductSelector 
                products={products}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </motion.div>
      );
    } else if (selectedSectionType === 'category') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CategorySelector 
            categories={categories}
            selectedCategoryId={newCategoryId}
            onCategorySelect={setNewCategoryId}
            isLoading={isLoading}
          />
        </motion.div>
      );
    }
    
    return null;
  };

  const handleSubmit = () => {
    handleAddSection?.();
    onClose();
  };

  const isSubmitDisabled = 
    !newSection.trim() || 
    !selectedSectionType ||
    (selectedSectionType === 'category' && !newCategoryId) || 
    (selectedSectionType === 'custom' && customType === 'category' && !newCategoryId) ||
    (selectedSectionType === 'custom' && customType === 'products' && (!newProductIds || newProductIds.length === 0));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[550px] bg-background max-h-[90vh] overflow-hidden p-0 gap-0"
        dir="rtl"
      >
        <DialogHeader className="p-4 md:p-6 border-b sticky top-0 bg-background z-10">
          <DialogTitle className="text-xl font-bold">إضافة قسم جديد</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-5 overflow-y-auto py-4 px-4 md:px-6 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SectionTypeSelector 
              selectedSectionType={selectedSectionType}
              onTypeChange={handleTypeChange}
            />
          </motion.div>
          
          {selectedSectionType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SectionNameField 
                name={newSection}
                onNameChange={setNewSection}
                isCustom={selectedSectionType === 'custom'}
              />
            </motion.div>
          )}
          
          {renderCustomContent()}
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
            <Plus className="h-4 w-4" />
            <span>إضافة القسم</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionForm;
