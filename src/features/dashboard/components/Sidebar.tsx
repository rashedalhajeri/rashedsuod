
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import useAuth from "@/hooks/useAuth";
import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import LogoutButton from "./LogoutButton";
import { Mail, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { signOut, session } = useAuth();
  const userEmail = session?.user?.email || "";

  // تحديد وقت اليوم للتحية
  const [greeting, setGreeting] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setCurrentHour(hour);
      setGreeting(hour >= 5 && hour < 12 ? "صباح الخير" : "مساء الخير");
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  // رمز الوقت المناسب حسب الساعة
  const TimeIcon = currentHour >= 5 && currentHour < 18 ? Sun : Moon;

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

          {/* روابط القائمة */}
          <SidebarLinks 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            currentPath={location.pathname}
            closeMobileMenu={closeMobileMenu}
          />

          {/* تذييل القائمة */}
          <div className="p-3 mt-auto space-y-3 border-t border-gray-100 dark:border-gray-800">
            {/* بطاقة التحية */}
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                <TimeIcon size={18} className="text-primary-500" />
                <span className="font-medium text-gray-700 dark:text-gray-200">{greeting}</span>
              </div>
            )}
            
            {/* عرض البريد الإلكتروني */}
            {(!isCollapsed || isMobile) && userEmail && (
              <div className="flex items-center gap-2.5 px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{userEmail}</span>
              </div>
            )}
            
            {/* زر تسجيل الخروج */}
            <LogoutButton 
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
