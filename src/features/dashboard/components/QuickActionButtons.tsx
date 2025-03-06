
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tags, ShoppingBag, Settings } from "lucide-react";

const QuickActionButtons: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
        <Link to="/dashboard/products/new" className="flex flex-col items-center gap-2">
          <Package className="h-6 w-6 text-primary-500" />
          <span>إضافة منتج</span>
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
        <Link to="/dashboard/categories" className="flex flex-col items-center gap-2">
          <Tags className="h-6 w-6 text-primary-500" />
          <span>إدارة التصنيفات</span>
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
        <Link to="/dashboard/orders" className="flex flex-col items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary-500" />
          <span>تتبع الطلبات</span>
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-auto py-4 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
        <Link to="/dashboard/settings" className="flex flex-col items-center gap-2">
          <Settings className="h-6 w-6 text-primary-500" />
          <span>إعدادات المتجر</span>
        </Link>
      </Button>
    </div>
  );
};

export default QuickActionButtons;
