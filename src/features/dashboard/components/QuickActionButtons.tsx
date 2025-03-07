
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
