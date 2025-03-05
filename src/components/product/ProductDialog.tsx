
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import useStoreData from "@/hooks/use-store-data";
import { ProductBasicInfo } from "./product-dialog/ProductBasicInfo";
import { ProductImagesTab } from "./product-dialog/ProductImagesTab";
import { ProductInventoryTab } from "./product-dialog/ProductInventoryTab";
import { useProductForm } from "./product-dialog/use-product-form";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { data: storeData } = useStoreData();
  
  const {
    formData,
    formErrors,
    isUploading,
    resetForm,
    validateForm,
    handleInputChange,
    handleAddProduct
  } = useProductForm(storeData, onClose, onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-lg">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary/10 p-1.5 rounded-md">
              <ImagePlus className="h-5 w-5 text-primary" />
            </span>
            إضافة منتج جديد
          </DialogTitle>
          <DialogDescription>
            أدخل معلومات المنتج الذي تريد إضافته إلى متجرك.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="px-6 pt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">معلومات المنتج</TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-primary data-[state=active]:text-white">الصور</TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-white">المخزون والسعر</TabsTrigger>
          </TabsList>
          
          <div className="max-h-[60vh] overflow-y-auto py-2 pr-2 pl-0 -mr-2 scrollbar">
            <TabsContent value="details" className="m-0 space-y-4">
              <ProductBasicInfo 
                name={formData.name}
                description={formData.description || ''}
                nameError={formErrors.name}
                onInputChange={handleInputChange}
              />
            </TabsContent>
            
            <TabsContent value="images" className="m-0 space-y-4">
              <ProductImagesTab
                formData={formData}
                formErrors={formErrors}
                storeData={storeData}
                onFormDataChange={(newData) => {
                  if ('image_url' in newData) {
                    handleInputChange({
                      target: { name: 'image_url', value: newData.image_url }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                  if ('additional_images' in newData) {
                    handleInputChange({
                      target: { name: 'additional_images', value: newData.additional_images }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              />
            </TabsContent>
            
            <TabsContent value="inventory" className="m-0 space-y-4">
              <ProductInventoryTab
                price={formData.price}
                stockQuantity={formData.stock_quantity}
                currency={storeData?.currency || 'KWD'}
                priceError={formErrors.price}
                onInputChange={handleInputChange}
              />
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="p-6 bg-gray-50 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={() => handleAddProduct()}
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90"
          >
            إضافة المنتج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
