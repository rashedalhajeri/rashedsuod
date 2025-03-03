
import React from "react";
import { Bell, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface MobileHeaderProps {
  storeName: string | undefined;
  hasNotifications: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  storeName,
  hasNotifications
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-nav shadow-sm backdrop-blur-sm bg-white/90">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="relative h-8 w-8 mr-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-md shadow-md transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-md flex items-center justify-center border border-primary-100">
                <Store className="h-4 w-4 text-primary-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <h1 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {storeName || "المتجر"}
                </h1>
              </div>
              <span className="text-xs text-gray-500 -mt-1">لوحة التحكم</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 space-x-reverse">
            <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <span className="sr-only">الإشعارات</span>
              <Bell className="h-5 w-5" />
              {hasNotifications && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>}
            </button>
            
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
