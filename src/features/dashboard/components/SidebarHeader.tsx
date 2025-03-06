
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
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-500">Linok</span>
            <span className="text-sm font-medium text-gray-500">.me</span>
          </div>
        )}
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={closeMobileMenu}
          >
            <X size={18} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleToggleSidebar}
          >
            {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
