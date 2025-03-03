
import React, { ReactNode } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 rtl">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto py-4 px-0 md:mr-[250px] mr-[80px] transition-all duration-300">
        <div className="container py-4 px-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
