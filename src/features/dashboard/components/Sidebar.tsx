
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      
      if (hour >= 5 && hour < 12) {
        setGreeting("صباح الخير");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("مساء الخير");
      } else {
        setGreeting("مساء الخير");
      }
    };
    
    updateGreeting();
    // تحديث التحية كل ساعة
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

  const sidebarVariants = {
    expanded: {
      width: 250
    },
    collapsed: {
      width: 80
    },
    mobile: {
      width: "100%",
      maxWidth: 280
    }
  };

  const currentVariant = isMobile 
    ? "mobile" 
    : isCollapsed 
      ? "collapsed" 
      : "expanded";

  // رمز الوقت المناسب حسب الساعة
  const TimeIcon = currentHour >= 5 && currentHour < 18 ? Sun : Moon;

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 h-screen bg-white shadow-md z-40 overflow-hidden rtl flex flex-col",
          isMobile ? "border-none" : "border-l border-gray-200"
        )}
        style={{ 
          width: isMobile && !isMobileMenuOpen ? 0 : 
                 isCollapsed && !isMobile ? "80px" : "250px",
          right: isMobile && !isMobileMenuOpen ? "-100%" : 0,
          transition: "width 0.2s ease-in-out, right 0.2s ease-in-out"
        }}
      >
        <div className="flex flex-col h-full">
          <SidebarHeader 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            handleToggleSidebar={handleToggleSidebar}
            closeMobileMenu={closeMobileMenu}
          />

          <SidebarLinks 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            currentPath={location.pathname}
            closeMobileMenu={closeMobileMenu}
          />

          <div className="p-4 border-t border-gray-200 mt-auto space-y-3">
            {/* بطاقة التحية والايميل */}
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col px-3 py-3 rounded-lg bg-primary-50/80 text-sm">
                <div className="flex items-center gap-2 text-primary-700 mb-1.5">
                  <TimeIcon size={14} className="shrink-0" />
                  <span className="font-medium">{greeting}</span>
                </div>
              </div>
            )}
            
            {/* عرض الايميل فوق زر تسجيل الخروج */}
            {(!isCollapsed || isMobile) && userEmail && (
              <div className="flex items-center gap-2 px-3 py-2 text-gray-600 text-sm">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{userEmail}</span>
              </div>
            )}
            
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
