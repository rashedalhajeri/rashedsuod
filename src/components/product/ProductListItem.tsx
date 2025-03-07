
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Archive, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { Product } from "@/utils/products/types";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ProductListItemProps {
  product: Product;
  onSelect: (id: string, isSelected: boolean) => void;
  isSelected: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  onSelect, 
  isSelected, 
  onEdit,
  onRefresh
}) => {
  const {
    id,
    name,
    price,
    discount_price,
    stock_quantity,
    track_inventory,
    images,
    category,
    is_archived
  } = product;

  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isMobile = useIsMobile();
  const formatCurrency = getCurrencyFormatter();

  const imageUrl = images && images.length > 0
    ? images[0]
    : "/placeholder.svg";

  const hasDiscount = discount_price !== null && discount_price !== undefined;
  
  // Show different stock status badges
  const getStockBadge = () => {
    if (!track_inventory) return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">كمية غير محدودة</Badge>
    );
    
    if (stock_quantity <= 0) {
      return <Badge variant="destructive" className="text-xs">نفذت الكمية</Badge>;
    } else if (stock_quantity <= 5) {
      return <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">كمية منخفضة</Badge>;
    }
    
    return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">{stock_quantity} متوفر</Badge>;
  };

  const handleArchiveToggle = async () => {
    setIsProcessing(true);
    try {
      const newArchiveStatus = !is_archived;
      
      const { error } = await supabase
        .from('products')
        .update({ is_archived: newArchiveStatus })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: newArchiveStatus ? "تم أرشفة المنتج" : "تم إلغاء أرشفة المنتج",
        description: `تم ${newArchiveStatus ? 'أرشفة' : 'إلغاء أرشفة'} المنتج بنجاح`,
      });
      
      // Refresh the product list
      onRefresh();
    } catch (error: any) {
      console.error("Error toggling archive status:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث حالة الأرشفة",
      });
    } finally {
      setIsProcessing(false);
      setShowArchiveDialog(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col sm:flex-row sm:items-center p-4 transition-colors ${isSelected ? 'bg-blue-50/60' : 'hover:bg-gray-50'} border-b`}>
        <div className="flex items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={checked => onSelect(id, !!checked)}
            className="mr-3 h-4 w-4"
          />
          
          <div className="flex items-center flex-1">
            <div className="h-16 w-16 sm:h-14 sm:w-14 rounded-xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
              <img
                src={imageUrl}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1 mb-1">
                {name}
                {is_archived && (
                  <Badge variant="outline" className="mr-2 text-xs bg-gray-100 text-gray-600">
                    مؤرشف
                  </Badge>
                )}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 mb-1">
                {getStockBadge()}
                
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-sm">
                {hasDiscount ? (
                  <div className="flex gap-1.5 items-center">
                    <span className="text-red-600 font-bold">{formatCurrency(discount_price!)}</span>
                    <span className="line-through text-gray-500 text-xs">{formatCurrency(price)}</span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex ml-auto mt-3 sm:mt-0 gap-1 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(id)}
            className="text-gray-500 hover:text-gray-700 h-8 w-8"
            title="تعديل"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-600 h-8 w-8"
            title={is_archived ? "إلغاء الأرشفة" : "أرشفة"}
            onClick={() => setShowArchiveDialog(true)}
          >
            {is_archived ? (
              <ArrowUpFromLine className="h-4 w-4" />
            ) : (
              <Archive className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{is_archived ? "إلغاء أرشفة المنتج" : "أرشفة المنتج"}</AlertDialogTitle>
            <AlertDialogDescription>
              {is_archived 
                ? "هل أنت متأكد من إلغاء أرشفة هذا المنتج؟ سيظهر المنتج مرة أخرى في المتجر."
                : "هل أنت متأكد من أرشفة هذا المنتج؟ لن يظهر المنتج في المتجر، لكن يمكنك إلغاء الأرشفة لاحقاً."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveToggle}
              className={is_archived ? "bg-green-500 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600"}
              disabled={isProcessing}
            >
              {isProcessing 
                ? "جاري المعالجة..." 
                : is_archived 
                  ? "إلغاء الأرشفة" 
                  : "أرشفة المنتج"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductListItem;
