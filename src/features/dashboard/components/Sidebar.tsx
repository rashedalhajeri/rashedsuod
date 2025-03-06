
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useContext } from "react";
import { AuthContext } from "@/App";
import SidebarHeader from "./SidebarHeader";
import SidebarLinks from "./SidebarLinks";
import LogoutButton from "./LogoutButton";

interface SidebarProps {
  isMobileMenuOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen = false }) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const { signOut } = useContext(AuthContext);

  // إعادة تعيين حالة القائمة عند تغيير حجم الشاشة
  useEffect(() => {
    setIsCollapsed(isMobile && !isMobileMenuOpen);
  }, [isMobile, isMobileMenuOpen]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileMenu = () => {
    // فقط إغلاق في حال العرض المحمول
    // Left empty intentionally as in the original
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

  // تحديد النمط المناسب للقائمة الجانبية
  const currentVariant = isMobile 
    ? "mobile" 
    : isCollapsed 
      ? "collapsed" 
      : "expanded";

  return (
    <AnimatePresence>
      {/* طبقة التعتيم عند فتح القائمة في الجوال */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileMenu}
        />
      )}

      <motion.div
        className={cn(
          "fixed top-0 right-0 h-screen bg-white shadow-md z-40 overflow-hidden rtl flex flex-col",
          isMobile ? "border-none" : "border-l border-gray-200"
        )}
        initial={false}
        animate={currentVariant}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
        style={{ 
          right: isMobile && !isMobileMenuOpen ? "-100%" : 0,
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

          <div className="p-4 border-t border-gray-200">
            <LogoutButton 
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Import cn function which was used in the original Sidebar
import { cn } from "@/lib/utils";

export default Sidebar;
