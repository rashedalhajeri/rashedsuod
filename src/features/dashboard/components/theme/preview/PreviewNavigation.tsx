
import React from "react";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

const PreviewNavigation: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 border-b overflow-auto">
      <div className="flex gap-3 text-xs">
        <div className="flex flex-col items-center">
          <Home className="w-4 h-4" />
          <span>الرئيسية</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingBag className="w-4 h-4" />
          <span>المنتجات</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-4 h-4" />
          <span>المفضلة</span>
        </div>
        <div className="flex flex-col items-center">
          <User className="w-4 h-4" />
          <span>حسابي</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewNavigation;
