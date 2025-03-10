
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { sectionTypes } from "./form/section-config";
import { useSectionForm } from "./form/useSectionForm";
import SectionTypeSelector from "./form/SectionTypeSelector";
import SectionNameField from "./form/SectionNameField";
import CustomTypeSelector from "./form/CustomTypeSelector";
import CategorySelector from "./form/CategorySelector";
import ProductSelector from "./form/ProductSelector";

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
  setNewDisplayStyle?: (style: 'grid' | 'list') => void;
  handleAddSection: () => void;
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
  setNewDisplayStyle = () => {},
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

  // Apply section type and name when selection changes
  useEffect(() => {
    if (selectedSectionType) {
      setNewSectionType(selectedSectionType);
      const selectedType = sectionTypes.find(type => type.id === selectedSectionType);
      if (selectedType && selectedType.id !== 'custom') {
        setNewSection(selectedType.name);
      }
    }
  }, [selectedSectionType, setNewSectionType, setNewSection]);

  // Function to render custom content based on selected section type
  const renderCustomContent = () => {
    if (selectedSectionType === 'custom') {
      return (
        <>
          <CustomTypeSelector 
            customType={customType}
            onCustomTypeChange={handleCustomTypeChange}
          />
          
          {/* Show category or product selector based on custom type */}
          {customType === 'category' && (
            <CategorySelector 
              categories={categories}
              selectedCategoryId={newCategoryId}
              onCategorySelect={setNewCategoryId}
              isLoading={isLoading}
            />
          )}
          {customType === 'products' && (
            <ProductSelector 
              products={products}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
              isLoading={isLoading}
            />
          )}
        </>
      );
    } else if (selectedSectionType === 'category') {
      return (
        <CategorySelector 
          categories={categories}
          selectedCategoryId={newCategoryId}
          onCategorySelect={setNewCategoryId}
          isLoading={isLoading}
        />
      );
    }
    
    return null;
  };

  const handleSubmit = () => {
    handleAddSection();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">إضافة قسم جديد</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 overflow-y-auto py-4 pr-2 pl-6">
          <SectionTypeSelector 
            selectedSectionType={selectedSectionType}
            onTypeChange={handleTypeChange}
          />
          
          {selectedSectionType && selectedSectionType !== 'custom' && (
            <SectionNameField 
              name={newSection}
              onNameChange={setNewSection}
              isCustom={false}
            />
          )}
          
          {selectedSectionType === 'custom' && (
            <SectionNameField 
              name={newSection}
              onNameChange={setNewSection}
              isCustom={true}
            />
          )}
          
          {renderCustomContent()}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={
              !newSection.trim() || 
              !selectedSectionType ||
              (selectedSectionType === 'category' && !newCategoryId) || 
              (selectedSectionType === 'custom' && customType === 'category' && !newCategoryId) ||
              (selectedSectionType === 'custom' && customType === 'products' && (!newProductIds || newProductIds.length === 0))
            }
            className="gap-2"
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
