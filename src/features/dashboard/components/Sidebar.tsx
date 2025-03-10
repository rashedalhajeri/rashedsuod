
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import useAuth from "@/hooks/useAuth";
import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  isMobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { signOut, session } = useAuth();
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.user_metadata?.full_name || "المستخدم";
  
  useEffect(() => {
    setIsCollapsed(isMobile && !isMobileMenuOpen);
  }, [isMobile, isMobileMenuOpen]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      {/* طبقة التعتيم خلف القائمة في الأجهزة المحمولة */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* القائمة الجانبية */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen z-40 overflow-hidden rtl flex flex-col transition-all duration-300 ease-in-out",
          "bg-white dark:bg-gray-900 shadow-lg",
          isMobile ? "border-none" : "border-l border-gray-200 dark:border-gray-800"
        )}
        style={{ 
          width: isMobile && !isMobileMenuOpen ? 0 : 
                 isCollapsed && !isMobile ? "80px" : "240px",
          right: isMobile && !isMobileMenuOpen ? "-100%" : 0,
        }}
      >
        <div className="flex flex-col h-full">
          {/* رأس القائمة الجانبية */}
          <SidebarHeader 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            handleToggleSidebar={handleToggleSidebar}
            closeMobileMenu={closeMobileMenu}
          />
          
          {/* معلومات المستخدم والإشعارات في الأعلى */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
            {/* عرض اسم المستخدم مع القائمة المنسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <User size={18} className="text-primary-500 shrink-0" />
                  <span className={cn("font-medium text-gray-700 dark:text-gray-200 truncate", isCollapsed && !isMobile && "hidden")}>
                    {userName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userEmail && (
                  <DropdownMenuItem className="flex items-center gap-2 cursor-default">
                    <span className="truncate text-xs">{userEmail}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  إدارة اشتراكاتي
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 hover:text-red-600" onClick={handleLogout}>
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* إشعارات */}
            {!isCollapsed && (
              <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Bell size={18} className="text-gray-500" />
              </button>
            )}
          </div>

          {/* روابط القائمة */}
          <SidebarLinks 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            currentPath={location.pathname}
            closeMobileMenu={closeMobileMenu}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
