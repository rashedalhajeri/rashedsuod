
import React, { useState } from "react";
import { Trash2, Tag, Copy, Archive, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductBulkActionsProps {
  selectedCount: number;
  selectedIds?: string[];
  onActionComplete: () => void;
}

export const ProductBulkActions: React.FC<ProductBulkActionsProps> = ({
  selectedCount,
  selectedIds = [],
  onActionComplete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedIds);
        
      if (error) {
        console.error("Error deleting products:", error);
        toast({
          variant: "destructive",
          title: "خطأ في حذف المنتجات",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف ${selectedCount} منتج بنجاح`,
      });
      
      onActionComplete();
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
        <span className="text-sm font-medium">
          تم تحديد {selectedCount} منتج
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 ml-2" />
          حذف
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
        >
          <Tag className="h-4 w-4 ml-2" />
          تعيين فئة
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
        >
          <Copy className="h-4 w-4 ml-2" />
          نسخ
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
        >
          <Archive className="h-4 w-4 ml-2" />
          أرشفة
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
        >
          <CheckCircle className="h-4 w-4 ml-2" />
          تحديث المخزون
        </Button>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف {selectedCount} منتج؟ هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
