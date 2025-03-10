
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  isMobile: boolean;
  handleToggleSidebar: () => void;
  closeMobileMenu: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  isMobile,
  handleToggleSidebar,
  closeMobileMenu
}) => {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {(!isCollapsed || isMobile) ? (
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-800 dark:text-white leading-none">Linok</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">.me</span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={closeMobileMenu}
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800",
              isCollapsed && "mx-auto"
            )}
            onClick={handleToggleSidebar}
          >
            {isCollapsed ? (
              <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight size={18} className="text-gray-500 dark:text-gray-400" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
