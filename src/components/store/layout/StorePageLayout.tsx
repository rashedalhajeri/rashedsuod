
import React from "react";
import StoreHeader from "../header/StoreHeader";
import { motion } from "framer-motion";

interface StorePageLayoutProps {
  children: React.ReactNode;
  storeName: string;
  logoUrl?: string | null;
  showBackButton?: boolean;
}

const StorePageLayout: React.FC<StorePageLayoutProps> = ({
  children,
  storeName,
  logoUrl,
  showBackButton
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader 
        storeName={storeName}
        logoUrl={logoUrl}
        showBackButton={showBackButton}
      />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-6"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default StorePageLayout;
