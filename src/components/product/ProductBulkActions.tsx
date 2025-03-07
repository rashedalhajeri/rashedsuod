
import React, { useState } from "react";
import { CheckCircle, CircleSlash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { databaseClient } from "@/integrations/database/client";

interface ProductBulkActionsProps {
  selectedProducts: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

const ProductBulkActions: React.FC<ProductBulkActionsProps> = ({
  selectedProducts,
  onClearSelection,
  onRefresh
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (selectedProducts.length === 0) {
    return null;
  }
  
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    setIsProcessing(true);
    try {
      const { success, error, deletedCount } = await databaseClient.products.bulkDeleteProducts(selectedProducts);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "فشل في حذف المنتجات",
          description: error?.message || "حدث خطأ أثناء محاولة حذف المنتجات",
        });
        return;
      }
      
      toast({
        title: "تم تنفيذ العملية بنجاح",
        description: `تم حذف ${deletedCount} منتج بنجاح`,
      });
      
      onClearSelection();
      onRefresh();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: error?.message || "حدث خطأ غير متوقع أثناء تنفيذ العملية",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBulkActivate = async (activate: boolean) => {
    if (selectedProducts.length === 0) return;
    
    setIsProcessing(true);
    try {
      const { success, error } = await databaseClient.products.bulkActivateProducts(selectedProducts, activate);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: activate ? "فشل في تفعيل المنتجات" : "فشل في إلغاء تفعيل المنتجات",
          description: error?.message || "حدث خطأ أثناء تنفيذ العملية",
        });
        return;
      }
      
      toast({
        title: "تم تنفيذ العملية بنجاح",
        description: activate 
          ? `تم تفعيل ${selectedProducts.length} منتج بنجاح` 
          : `تم إلغاء تفعيل ${selectedProducts.length} منتج بنجاح`,
      });
      
      onClearSelection();
      onRefresh();
      
      if (activate) {
        setIsActivateDialogOpen(false);
      } else {
        setIsDeactivateDialogOpen(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: error?.message || "حدث خطأ غير متوقع أثناء تنفيذ العملية",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1.5 z-50 flex items-center gap-1 backdrop-blur-sm bg-opacity-95">
        <span className="text-xs font-medium ml-1">تم تحديد {selectedProducts.length}</span>
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Button
          size="sm"
          variant="ghost"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 px-2"
          onClick={() => setIsActivateDialogOpen(true)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-xs">تفعيل</span>
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2"
          onClick={() => setIsDeactivateDialogOpen(true)}
        >
          <CircleSlash className="h-4 w-4 mr-1" />
          <span className="text-xs">تعطيل</span>
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs">حذف</span>
        </Button>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="تأكيد حذف المنتجات"
        description={`هل أنت متأكد من رغبتك بحذف ${selectedProducts.length} منتج؟ لا يمكن التراجع عن هذه العملية.`}
        confirmText="حذف المنتجات"
        cancelText="إلغاء"
        onConfirm={handleBulkDelete}
        confirmButtonProps={{ 
          variant: "destructive",
          disabled: isProcessing,
          className: "bg-red-500 hover:bg-red-600"
        }}
      />
      
      {/* Activate Confirmation Dialog */}
      <ConfirmDialog
        open={isActivateDialogOpen}
        onOpenChange={setIsActivateDialogOpen}
        title="تأكيد تفعيل المنتجات"
        description={`هل أنت متأكد من رغبتك في تفعيل ${selectedProducts.length} منتج؟`}
        confirmText="تفعيل المنتجات"
        cancelText="إلغاء"
        onConfirm={() => handleBulkActivate(true)}
        confirmButtonProps={{ 
          disabled: isProcessing,
          className: "bg-green-500 hover:bg-green-600"
        }}
      />
      
      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
        title="تأكيد تعطيل المنتجات"
        description={`هل أنت متأكد من رغبتك في تعطيل ${selectedProducts.length} منتج؟`}
        confirmText="تعطيل المنتجات"
        cancelText="إلغاء"
        onConfirm={() => handleBulkActivate(false)}
        confirmButtonProps={{ 
          variant: "outline",
          disabled: isProcessing,
          className: "text-gray-600 border-gray-200 hover:bg-gray-50"
        }}
      />
    </>
  );
};

export default ProductBulkActions;
