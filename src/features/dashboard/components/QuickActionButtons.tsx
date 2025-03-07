
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tags, ShoppingBag, Settings } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";
import ProductFormDialog from "@/components/product/ProductFormDialog";

const QuickActionButtons: React.FC = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { data: storeData } = useStoreData();

  const handleAddProductSuccess = () => {
    // Could add a toast notification here
    setIsAddProductOpen(false);
  };

  const actions = [
    {
      icon: <Tags className="h-4 w-4" />,
      label: "التصنيفات",
      path: "/dashboard/categories"
    },
    {
      icon: <ShoppingBag className="h-4 w-4" />,
      label: "الطلبات",
      path: "/dashboard/orders"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "الإعدادات",
      path: "/dashboard/settings"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
          onClick={() => setIsAddProductOpen(true)}
        >
          <Package className="h-4 w-4" />
          <span className="text-xs">إضافة منتج</span>
        </Button>
        
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            asChild
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <Link to={action.path}>
              {action.icon}
              <span className="text-xs">{action.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      
      <ProductFormDialog
        isOpen={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        storeId={storeData?.id}
        onAddSuccess={handleAddProductSuccess}
      />
    </>
  );
};

export default QuickActionButtons;
