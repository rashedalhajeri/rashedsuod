
import React from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: any;
  currency?: string;
}

const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product,
  currency = "SAR"
}) => {
  const formatCurrency = getCurrencyFormatter(currency);

  const renderProductImagesPreview = () => {
    if (!product) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {product.image_url && (
            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border border-red-100">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
          
          {product.additional_images && Array.isArray(product.additional_images) && product.additional_images.length > 0 && 
            product.additional_images.map((url: string, index: number) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden border border-red-100">
                <img 
                  src={url} 
                  alt={`${product.name} - ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">حذف المنتج</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 p-3 bg-red-50 rounded-md border border-red-100">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white rounded overflow-hidden border border-red-100">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              ) : (
                <Package className="h-6 w-6 text-gray-400 m-3" />
              )}
            </div>
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">السعر: {formatCurrency(product.price)}</p>
            </div>
          </div>
          
          {(product.image_url || (product.additional_images && Array.isArray(product.additional_images) && product.additional_images.length > 0)) && (
            <div className="mt-2">
              <p className="text-sm font-medium text-red-600 mb-2">سيتم حذف الصور التالية:</p>
              {renderProductImagesPreview()}
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 flex-row justify-end">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            حذف المنتج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDeleteDialog;
