
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
    <div className="p-4 border-b border-gray-200 bg-primary-50/50">
      <div className="flex items-center justify-between">
        {(!isCollapsed || isMobile) ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-primary-600">Linok</span>
            <span className="text-sm font-medium text-gray-500">.me</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-sm">L</span>
          </div>
        )}
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-primary-100"
            onClick={closeMobileMenu}
          >
            <X size={16} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-primary-100"
            onClick={handleToggleSidebar}
          >
            {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
