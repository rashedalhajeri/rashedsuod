
import React, { useState } from "react";
import { Trash2, Tag, Copy, Archive, CheckCircle, ChevronDown, RefreshCw, ArrowUpCircle, AlertTriangle } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { databaseClient } from "@/integrations/database/client";

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
  const [isArchiving, setIsArchiving] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    
    setIsDeleting(true);
    try {
      // First check if any selected products are referenced in order_items
      const { data: orderItems, error: checkError } = await supabase
        .from("order_items")
        .select("product_id")
        .in("product_id", selectedIds);
        
      if (checkError) {
        console.error("Error checking order items:", checkError);
        toast({
          variant: "destructive",
          title: "خطأ في التحقق من الطلبات",
          description: checkError.message,
        });
        return;
      }
      
      // Filter out products that are referenced in orders
      const productsInOrders = orderItems ? orderItems.map(item => item.product_id) : [];
      const productsToDelete = selectedIds.filter(id => !productsInOrders.includes(id));
      
      // If there are products we can't delete, notify the user
      if (productsToDelete.length < selectedIds.length) {
        toast({
          variant: "destructive",
          title: "تنبيه",
          description: `${selectedIds.length - productsToDelete.length} منتجات مرتبطة بطلبات ولا يمكن حذفها.`,
        });
        
        if (productsToDelete.length === 0) {
          setIsDeleting(false);
          setShowDeleteDialog(false);
          return;
        }
      }
      
      // Delete products that aren't referenced in orders
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', productsToDelete);
        
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
        description: `تم حذف ${productsToDelete.length} منتج بنجاح`,
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

  const handleBulkArchive = async () => {
    if (!selectedIds.length) return;
    
    setIsArchiving(true);
    try {
      const { success, error } = await databaseClient.products.bulkArchiveProducts(selectedIds, true);
        
      if (!success) {
        console.error("Error archiving products:", error);
        toast({
          variant: "destructive",
          title: "خطأ في أرشفة المنتجات",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "تمت الأرشفة بنجاح",
        description: `تم أرشفة ${selectedCount} منتج بنجاح`,
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
      setIsArchiving(false);
      setShowArchiveDialog(false);
    }
  };

  const handleBulkUnarchive = async () => {
    if (!selectedIds.length) return;
    
    setIsUnarchiving(true);
    try {
      const { success, error } = await databaseClient.products.bulkArchiveProducts(selectedIds, false);
        
      if (!success) {
        console.error("Error unarchiving products:", error);
        toast({
          variant: "destructive",
          title: "خطأ في إلغاء ��رشفة المنتجات",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: "تم إلغاء الأرشفة بنجاح",
        description: `تم إلغاء أرشفة ${selectedCount} منتج بنجاح`,
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
      setIsUnarchiving(false);
      setShowUnarchiveDialog(false);
    }
  };
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">
            تم تحديد {selectedCount} منتج
          </span>
        </div>
        
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <span className="ml-1">إجراءات</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-600 focus:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowArchiveDialog(true)}
              >
                <Archive className="h-4 w-4 ml-2" />
                أرشفة
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowUnarchiveDialog(true)}
              >
                <ArrowUpCircle className="h-4 w-4 ml-2" />
                إلغاء الأرشفة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 ml-2" />
                تعيين فئة
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 ml-2" />
                نسخ
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle className="h-4 w-4 ml-2" />
                تحديث المخزون
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 ml-auto">
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
              onClick={() => setShowArchiveDialog(true)}
            >
              <Archive className="h-4 w-4 ml-2" />
              أرشفة
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUnarchiveDialog(true)}
            >
              <ArrowUpCircle className="h-4 w-4 ml-2" />
              إلغاء الأرشفة
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
              <CheckCircle className="h-4 w-4 ml-2" />
              تحديث المخزون
            </Button>
          </div>
        )}
      </motion.div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف {selectedCount} منتج؟
              
              <div className="mt-4 p-3 bg-orange-50 text-orange-700 rounded-md text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">ملاحظة هامة</p>
                    <p>المنتجات المرتبطة بطلبات سابقة لا يمكن حذفها نهائياً.</p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري الحذف...
                </span>
              ) : "تأكيد الحذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أرشفة {selectedCount} منتج؟ المنتجات المؤرشفة لن تظهر في المتجر، لكن يمكنك استعادتها في أي وقت.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkArchive}
              disabled={isArchiving}
            >
              {isArchiving ? "جاري الأرشفة..." : "تأكيد الأرشفة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد إلغاء الأرشفة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من إلغاء أرشفة {selectedCount} منتج؟ المنتجات ستظهر مرة أخرى في المتجر.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkUnarchive}
              disabled={isUnarchiving}
            >
              {isUnarchiving ? "جاري إلغاء الأرشفة..." : "تأكيد إلغاء الأرشفة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
