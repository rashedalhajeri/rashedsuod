
import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import useStoreData from "@/hooks/use-store-data";
import RealTimeNotifications from "@/features/dashboard/components/RealTimeNotifications";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { data: storeData } = useStoreData();
  const location = useLocation();
  
  // إضافة حالة لعرض القائمة الجانبية في الهواتف
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // إغلاق القائمة الجانبية عند تغيير المسار في الأجهزة المحمولة
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // فتح وإغلاق القائمة الجانبية في الأجهزة المحمولة
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 rtl">
      {/* Sidebar Component */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
      
      {/* Add notifications component if store exists */}
      {storeData?.id && <RealTimeNotifications storeId={storeData.id} />}
      
      {/* Mobile menu button */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md bg-white"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      )}
      
      {/* Main content */}
      <motion.main 
        className={`flex-1 overflow-x-hidden overflow-y-auto py-2 px-0 transition-all duration-300 ${
          isMobile ? "mr-0" : isTablet ? "mr-[80px]" : "mr-[250px]"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overlay for mobile menu */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/40 z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
        
        <div className="container py-2 px-3 md:px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
