
import React from "react";
import { Bell, Settings, Store, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SidebarHeaderProps {
  storeName: string | undefined;
  domainName: string | undefined;
  hasNotifications: boolean;
  onLogout: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  storeName,
  domainName,
  hasNotifications,
  onLogout
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center mx-0">
        <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center mr-2 shadow-sm mx-[6px]">
          <Store className="h-5 w-5 text-primary-600 mx-0" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{storeName || "المتجر"}</h3>
          <p className="text-xs text-gray-500">{domainName || "my-store"}.linok.me</p>
        </div>
      </div>
      
      {!isMobile && (
        <div className="flex items-center gap-1">
          <button className="relative p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
            <Bell className="h-4 w-4" />
            {hasNotifications && <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white animate-pulse"></span>}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                <Settings className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer w-full">
                  <Settings className="ml-2 h-4 w-4" />
                  <span>الإعدادات</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => window.open(`https://${domainName}.linok.me`, '_blank')} 
                className="cursor-pointer"
              >
                <Store className="ml-2 h-4 w-4" />
                <span>زيارة المتجر</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                <LogOut className="ml-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
