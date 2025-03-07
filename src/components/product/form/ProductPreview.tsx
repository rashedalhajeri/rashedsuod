
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface ProductPreviewProps {
  name: string;
  price: number;
  discount_price: number | null;
  description: string;
  images: string[];
  onDelete: () => void;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  name,
  price,
  discount_price,
  description,
  images,
  onDelete
}) => {
  const formatCurrency = getCurrencyFormatter();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>معاينة المنتج</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden mb-4">
          {images.length > 0 ? (
            <img 
              src={images[0]} 
              alt={name} 
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>
        
        <h3 className="font-medium text-lg mb-1">{name || "اسم المنتج"}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-primary">
            {formatCurrency(discount_price || price || 0)}
          </span>
          {discount_price && (
            <span className="text-sm line-through text-gray-400">
              {formatCurrency(price || 0)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description || "لا يوجد وصف للمنتج"}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">حذف المنتج</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف المنتج بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  تأكيد الحذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPreview;
