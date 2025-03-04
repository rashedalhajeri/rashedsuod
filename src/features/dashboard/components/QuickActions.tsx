
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, Tags, ShoppingBag, Settings } from "lucide-react";

const QuickActions: React.FC = () => {
  const actionItems = [
    {
      icon: <Package className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />,
      label: "إضافة منتج",
      path: "/dashboard/products/new"
    },
    {
      icon: <Tags className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />,
      label: "إدارة التصنيفات",
      path: "/dashboard/categories"
    },
    {
      icon: <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />,
      label: "تتبع الطلبات",
      path: "/dashboard/orders"
    },
    {
      icon: <Settings className="h-5 w-5 md:h-6 md:w-6 text-primary-500" />,
      label: "إعدادات المتجر",
      path: "/dashboard/settings"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {actionItems.map((item, index) => (
        <Button 
          key={index}
          asChild 
          variant="outline" 
          className="h-auto py-3 border-gray-200 hover:border-primary-200 hover:bg-primary-50"
        >
          <Link to={item.path} className="flex flex-col items-center gap-2">
            {item.icon}
            <span className="text-xs md:text-sm">{item.label}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
