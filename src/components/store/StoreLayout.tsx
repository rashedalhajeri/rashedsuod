
import React, { ReactNode } from "react";
import StoreNavbar from "@/components/store/StoreNavbar";
import StoreFooter from "@/components/store/StoreFooter";
import { StoreFilterProvider } from "@/context/StoreFilterContext";
import "@/styles/responsive.css";

interface StoreLayoutProps {
  children: ReactNode;
  storeData: any;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children, storeData }) => {
  return (
    <StoreFilterProvider>
      <div className="min-h-screen flex flex-col bg-gray-50" dir="rtl">
        <StoreNavbar storeName={storeData?.store_name} logoUrl={storeData?.logo_url} />
        
        {/* Add top padding to account for fixed header */}
        <main className="flex-grow container mx-auto px-4 pt-32 categories-content">
          {children}
        </main>
        
        <StoreFooter storeName={storeData?.store_name} />
      </div>
    </StoreFilterProvider>
  );
};

export default StoreLayout;
