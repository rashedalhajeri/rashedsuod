
import React, { ReactNode } from "react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import useStoreData from "@/hooks/use-store-data";
import OrderNotifications from "@/features/orders/components/OrderNotifications";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: storeData } = useStoreData();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 rtl">
      <Sidebar />
      
      {/* إضافة مكون الإشعارات إذا كان المتجر موجودًا */}
      {storeData?.id && <OrderNotifications storeId={storeData.id} />}
      
      <motion.main 
        className="flex-1 overflow-x-hidden overflow-y-auto py-4 px-0 md:mr-[250px] mr-[80px] transition-all duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-4 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
