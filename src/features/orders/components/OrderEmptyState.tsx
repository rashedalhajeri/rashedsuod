
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus } from "lucide-react";

const OrderEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">لا توجد طلبات</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        لم يتم تسجيل أي طلبات بعد. قم بإضافة طلبك الأول وابدأ في إدارة مبيعاتك بسهولة.
      </p>
      
      <Button asChild>
        <Link to="/dashboard/orders/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة طلب جديد
        </Link>
      </Button>
    </div>
  );
};

export default OrderEmptyState;
