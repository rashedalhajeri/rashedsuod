
import React from "react";
import { Package, Settings, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OverviewTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">المنتجات</h2>
          <Package className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">إدارة منتجات متجرك</p>
        <Button variant="ghost" className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" asChild>
          <Link to="/products">
            إدارة المنتجات
            <ArrowRight className="mr-1 h-4 w-4 inline-block" />
          </Link>
        </Button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>
          <Settings className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">تخصيص إعدادات متجرك</p>
        <Button variant="ghost" className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" asChild>
          <Link to="/settings">
            تعديل الإعدادات
            <ArrowRight className="mr-1 h-4 w-4 inline-block" />
          </Link>
        </Button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary-200 border border-gray-100 group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">المتجر</h2>
          <Home className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-gray-600 mb-4">زيارة المتجر الخاص بك</p>
        <Button 
          className="text-primary-600 font-medium hover:underline bg-transparent group-hover:bg-primary-50 flex items-center" 
          variant="ghost" 
          onClick={() => window.open(`https://${window.location.hostname.includes('linok.me') ? window.location.hostname : 'yourdomain.linok.me'}`, '_blank')}
        >
          عرض المتجر
          <ArrowRight className="mr-1 h-4 w-4 inline-block" />
        </Button>
      </div>
    </div>
  );
};

export default OverviewTab;
