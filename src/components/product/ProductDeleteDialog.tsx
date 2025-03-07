
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Product } from "@/utils/product-helpers";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  onDeleteSuccess: () => void;
}

const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  onDeleteSuccess
}) => {
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
        
      if (error) {
        console.error("Error deleting product:", error);
        toast.error("حدث خطأ أثناء حذف المنتج");
        return;
      }
      
      toast.success("تم حذف المنتج بنجاح");
      onOpenChange(false);
      onDeleteSuccess();
    } catch (error) {
      console.error("Error in handleDeleteProduct:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف المنتج</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={handleDeleteProduct}>
            حذف المنتج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDeleteDialog;
