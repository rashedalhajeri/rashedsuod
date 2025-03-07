
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tags, ShoppingBag, Settings } from "lucide-react";

const QuickActionButtons: React.FC = () => {
  const actions = [
    {
      icon: <Package className="h-4 w-4" />,
      label: "إضافة منتج",
      path: "/dashboard/products/new"
    },
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
  );
};

export default QuickActionButtons;
