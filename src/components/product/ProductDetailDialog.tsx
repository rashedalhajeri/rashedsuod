
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { useProductDetailForm } from "@/hooks/useProductDetailForm";
import { AlertTriangle, X, Save, Trash, Archive, Eye, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

// Import form sections
import BasicInfoSection from "./form/BasicInfoSection";
import InventorySection from "./form/InventorySection";
import AdvancedFeaturesSection from "./form/AdvancedFeaturesSection";
import ProductImagesSection from "./form/ProductImagesSection";
import ConditionalSections from "./form/ConditionalSections";
import FormSection from "./form/FormSection";
import CategorySelector from "./form/CategorySelector";
import SectionSelector from "./form/SectionSelector";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ProductDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
  storeData: any;
  onSuccess?: () => void;
}

const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  productId,
  storeData,
  onSuccess,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  
  const {
    isLoading,
    isSubmitting,
    error,
    formData,
    categories,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSectionChange,
    handleSave,
    handleDelete,
    handleArchive,
    toggleDiscount
  } = useProductDetailForm({ 
    productId, 
    storeData,
    onOpenChange,
    onSuccess
  });

  const handleColorsChange = (colors: string[]) => {
    handleSwitchChange('available_colors', colors as any);
  };

  const handleSizesChange = (sizes: string[]) => {
    handleSwitchChange('available_sizes', sizes as any);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmArchive = () => {
    setShowArchiveConfirm(true);
  };

  const executeDelete = async () => {
    await handleDelete();
    setShowDeleteConfirm(false);
  };

  const executeArchive = async () => {
    await handleArchive(!formData.is_archived);
    setShowArchiveConfirm(false);
    toast.success(
      formData.is_archived ? "تم إلغاء أرشفة المنتج بنجاح" : "تم أرشفة المنتج بنجاح",
      { description: formData.is_archived ? "المنتج الآن مرئي في المتجر" : "المنتج الآن غير مرئي في المتجر" }
    );
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <LoadingState message="جاري تحميل بيانات المنتج..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <ErrorState 
            title="خطأ في تحميل المنتج"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </DialogContent>
      </Dialog>
    );
  }

  const isUpdating = !!productId;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-xl rounded-lg border-0">
          <div className="absolute right-4 top-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">إغلاق</span>
            </Button>
          </div>
          
          <DialogHeader className="space-y-1 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {isUpdating ? "تعديل المنتج" : "إضافة منتج جديد"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              قم بتعديل معلومات المنتج حسب احتياجك
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 p-1">
            {/* القسم الأول: المعلومات الأساسية والصور */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* القسم الأيمن - المعلومات الأساسية */}
              <div className="md:col-span-7 space-y-6">
                <BasicInfoSection 
                  name={formData.name}
                  description={formData.description}
                  price={formData.price}
                  discountPrice={formData.discount_price}
                  handleInputChange={handleChange}
                  toggleDiscount={toggleDiscount}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CategorySelector
                    categoryId={formData.category_id}
                    storeId={storeData?.id}
                    onCategoryChange={handleCategoryChange}
                  />

                  <SectionSelector
                    sectionId={formData.section_id}
                    storeId={storeData?.id}
                    onSectionChange={handleSectionChange}
                  />
                </div>
                
                <InventorySection 
                  trackInventory={formData.track_inventory}
                  stockQuantity={formData.stock_quantity}
                  handleInputChange={handleChange}
                  handleSwitchChange={handleSwitchChange}
                />
              </div>
              
              {/* القسم الأيسر - صور المنتج */}
              <div className="md:col-span-5">
                <ProductImagesSection 
                  images={formData.images}
                  storeId={storeData?.id}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </div>
            </div>
            
            {/* قسم الخصائص المتقدمة */}
            <FormSection>
              <AdvancedFeaturesSection 
                hasColors={formData.has_colors}
                hasSizes={formData.has_sizes}
                requireCustomerName={formData.require_customer_name}
                requireCustomerImage={formData.require_customer_image}
                handleSwitchChange={handleSwitchChange}
              />
            </FormSection>
            
            {/* قسم الألوان والمقاسات - يظهر فقط عند تفعيلها */}
            <ConditionalSections 
              formData={formData}
              handleColorsChange={handleColorsChange}
              handleSizesChange={handleSizesChange}
            />
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            {isUpdating && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  <Trash className="h-4 w-4" />
                  حذف المنتج
                </Button>
                <Button
                  variant="outline"
                  onClick={confirmArchive}
                  disabled={isSubmitting}
                  className={`gap-2 ${formData.is_archived 
                    ? "border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"}`}
                >
                  {formData.is_archived ? (
                    <>
                      <ArrowUpCircle className="h-4 w-4" />
                      إلغاء الأرشفة
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4" />
                      أرشفة المنتج
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {!isUpdating && <div></div>}
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="تأكيد حذف المنتج"
        description={
          <>
            <p>هل أنت متأكد من رغبتك في حذف هذا المنتج؟</p>
            <div className="mt-3 p-3 bg-amber-50 text-amber-800 rounded-md text-sm flex gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">ملاحظة هامة</p>
                <p>المنتجات المرتبطة بطلبات سابقة لا يمكن حذفها نهائياً، سيتم أرشفتها فقط.</p>
              </div>
            </div>
          </>
        }
        confirmText="حذف المنتج"
        cancelText="إلغاء"
        onConfirm={executeDelete}
        confirmButtonProps={{ 
          variant: "destructive",
          className: "bg-red-500 hover:bg-red-600"
        }}
      />

      <ConfirmDialog
        open={showArchiveConfirm}
        onOpenChange={setShowArchiveConfirm}
        title={formData.is_archived ? "تأكيد إلغاء أرشفة المنتج" : "تأكيد أرشفة المنتج"}
        description={
          formData.is_archived 
            ? "إلغاء أرشفة هذا المنتج سيجعله ظاهراً مرة أخرى في المتجر. هل تريد المتابعة؟"
            : "أرشفة هذا المنتج سيخفيه من المتجر دون حذفه من قاعدة البيانات. يمكنك إلغاء الأرشفة في أي وقت."
        }
        confirmText={formData.is_archived ? "إلغاء الأرشفة" : "أرشفة المنتج"}
        cancelText="إلغاء"
        onConfirm={executeArchive}
        confirmButtonProps={{ 
          variant: "default",
          className: "bg-blue-600 hover:bg-blue-700"
        }}
      />
    </>
  );
};

export default ProductDetailDialog;
