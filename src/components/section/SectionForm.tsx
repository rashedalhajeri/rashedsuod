
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
import DisplayStyleSelector from "./form/DisplayStyleSelector";

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
    handleCustomTypeChange,
    categoryProducts,
    fetchCategoryProducts
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

  // Fetch products when category is selected
  useEffect(() => {
    if (newCategoryId) {
      fetchCategoryProducts(newCategoryId);
    }
  }, [newCategoryId, fetchCategoryProducts]);

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
              
              <div className="mt-4">
                <DisplayStyleSelector
                  displayStyle={newDisplayStyle}
                  setDisplayStyle={setNewDisplayStyle}
                />
              </div>
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
              
              <div className="mt-4">
                <DisplayStyleSelector
                  displayStyle={newDisplayStyle}
                  setDisplayStyle={setNewDisplayStyle}
                />
              </div>
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
          className="space-y-4"
        >
          <CategorySelector 
            categories={categories}
            selectedCategoryId={newCategoryId}
            onCategorySelect={setNewCategoryId}
            isLoading={isLoading}
          />
          
          <DisplayStyleSelector
            displayStyle={newDisplayStyle}
            setDisplayStyle={setNewDisplayStyle}
          />
          
          {newCategoryId && categoryProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-4 p-3 bg-gray-50 rounded-md border"
            >
              <div className="text-sm font-medium mb-2 flex justify-between items-center">
                <span>منتجات الفئة المختارة ({categoryProducts.length})</span>
                <Button variant="link" size="sm" className="text-primary p-0">
                  عرض الكل
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {categoryProducts.slice(0, 4).map(product => (
                  <div key={product.id} className="bg-white p-2 rounded border flex items-center space-x-2 space-x-reverse rtl">
                    <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.price} د.ك</div>
                    </div>
                  </div>
                ))}
              </div>
              {categoryProducts.length > 4 && (
                <div className="text-xs text-center text-gray-500 mt-2">
                  + {categoryProducts.length - 4} منتج آخر
                </div>
              )}
            </motion.div>
          )}
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
