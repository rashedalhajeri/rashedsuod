
import React, { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import useStoreData from "@/hooks/use-store-data";
import RealTimeNotifications from "@/features/dashboard/components/RealTimeNotifications";
import { Menu } from "lucide-react";
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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // إغلاق القائمة الجانبية عند تغيير المسار في الأجهزة المحمولة
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 rtl">
      {/* القائمة الجانبية */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} />
      
      {/* إشعارات المتجر */}
      {storeData?.id && <RealTimeNotifications storeId={storeData.id} />}
      
      {/* زر القائمة للأجهزة المحمولة */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-md bg-primary-500 hover:bg-primary-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={18} className="text-white" />
          </Button>
        </div>
      )}
      
      {/* المحتوى الرئيسي */}
      <main 
        className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${
          isMobile ? "mr-0" : isTablet ? "mr-[80px]" : "mr-[240px]"
        }`}
      >
        <div className="container py-4 px-4 md:px-6 max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
