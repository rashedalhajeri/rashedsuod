
import React from "react";
import { Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  storeName: string | null;
  domain?: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ storeName, domain }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">لوحة التحكم</h1>
        <p className="text-gray-600 flex items-center">
          مرحباً بك في متجرك {storeName}
          <span className="mr-2 text-xs bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-2 py-0.5 rounded-full inline-flex items-center border border-green-200">
            <Shield size={12} className="ml-1" />
            مؤمن ببروتوكول التشفير
          </span>
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => window.open(`https://${domain}.linok.me`, '_blank')} 
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 bg-white border-gray-200"
        >
          <Home className="h-4 w-4" />
          زيارة المتجر
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
