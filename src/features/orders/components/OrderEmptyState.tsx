
import React from "react";
import { ShoppingBag, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderEmptyStateProps {
  onCreateOrder?: () => void;
  message?: string;
}

const OrderEmptyState: React.FC<OrderEmptyStateProps> = ({ 
  onCreateOrder,
  message = "لا توجد طلبات بعد" 
}) => {
  return (
    <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg bg-gray-50">
      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{message}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        ستظهر طلبات العملاء هنا بمجرد استلامها.
      </p>
      
      {onCreateOrder && (
        <Button
          variant="outline"
          className="mt-4 gap-2"
          onClick={onCreateOrder}
        >
          <PackagePlus className="h-4 w-4" />
          إنشاء طلب جديد
        </Button>
      )}
    </div>
  );
};

export default OrderEmptyState;
