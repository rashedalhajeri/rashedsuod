
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";

interface StoreHeaderProps {
  storeName: string;
  logoUrl?: string | null;
  showBackButton?: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  storeName,
  logoUrl,
  showBackButton = false,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link
              to=".."
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
          
          <div className="flex items-center gap-3">
            {logoUrl && (
              <div className="w-8 h-8 rounded overflow-hidden bg-gray-50 border">
                <img 
                  src={logoUrl} 
                  alt={`شعار ${storeName}`} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <h1 className="font-bold text-lg">{storeName}</h1>
          </div>
        </div>

        <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </motion.header>
  );
};

export default StoreHeader;
