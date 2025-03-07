
import React, { useState } from "react";
import { Trash2, Tag, Copy, Archive, CheckCircle, ChevronDown, ArrowUpFromLine } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductBulkActionsProps {
  selectedCount: number;
  selectedIds?: string[];
  onActionComplete: () => void;
  showArchived?: boolean;
}

export const ProductBulkActions: React.FC<ProductBulkActionsProps> = ({
  selectedCount,
  selectedIds = [],
  onActionComplete,
  showArchived = false
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const isMobile = useIsMobile();
  
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

  const handleBulkArchiveToggle = async () => {
    if (!selectedIds.length) return;
    
    setIsArchiving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_archived: !showArchived })
        .in('id', selectedIds);
        
      if (error) {
        console.error("Error archiving products:", error);
        toast({
          variant: "destructive",
          title: showArchived ? "خطأ في إلغاء أرشفة المنتجات" : "خطأ في أرشفة المنتجات",
          description: error.message,
        });
        return;
      }
      
      toast({
        title: showArchived ? "تم إلغاء الأرشفة بنجاح" : "تم الأرشفة بنجاح",
        description: `تم ${showArchived ? 'إلغاء أرشفة' : 'أرشفة'} ${selectedCount} منتج بنجاح`,
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowArchiveDialog(true)}
              >
                {showArchived ? (
                  <>
                    <ArrowUpFromLine className="h-4 w-4 ml-2" />
                    إلغاء الأرشفة
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 ml-2" />
                    أرشفة
                  </>
                )}
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
              {showArchived ? (
                <>
                  <ArrowUpFromLine className="h-4 w-4 ml-2" />
                  إلغاء الأرشفة
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 ml-2" />
                  أرشفة
                </>
              )}
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
      
      {/* Delete confirmation dialog */}
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

      {/* Archive confirmation dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showArchived ? "تأكيد إلغاء الأرشفة" : "تأكيد الأرشفة"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showArchived 
                ? `هل أنت متأكد من إلغاء أرشفة ${selectedCount} منتج؟ ستظهر هذه المنتجات في المتجر مرة أخرى.`
                : `هل أنت متأكد من أرشفة ${selectedCount} منتج؟ لن تظهر هذه المنتجات في المتجر، لكن يمكنك إلغاء الأرشفة لاحقاً.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkArchiveToggle}
              className={showArchived ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}
              disabled={isArchiving}
            >
              {isArchiving 
                ? "جاري المعالجة..." 
                : showArchived 
                  ? "تأكيد إلغاء الأرشفة" 
                  : "تأكيد الأرشفة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
