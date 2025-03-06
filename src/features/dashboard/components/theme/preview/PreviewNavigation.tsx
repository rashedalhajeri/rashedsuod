
import React from "react";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

const PreviewNavigation: React.FC = () => {
  return (
    <div className="flex items-center justify-around py-3 px-2 bg-gray-100/80 backdrop-blur-sm border-b overflow-auto">
      <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
        <Home className="w-5 h-5" />
        <span className="text-xs font-medium">الرئيسية</span>
      </div>
      <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-xs font-medium">المنتجات</span>
      </div>
      <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
        <Heart className="w-5 h-5" />
        <span className="text-xs font-medium">المفضلة</span>
      </div>
      <div className="flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
        <User className="w-5 h-5" />
        <span className="text-xs font-medium">حسابي</span>
      </div>
    </div>
  );
};

export default PreviewNavigation;
