
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface StoreBannerProps {
  storeName: string;
  storeDescription?: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StoreBanner: React.FC<StoreBannerProps> = ({
  storeName,
  storeDescription,
  searchQuery,
  onSearchChange
}) => {
  // Extract initial for avatar display
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(storeName || "Store");

  return (
    <div className="bg-gradient-to-r from-blue-700 to-green-500 py-6 px-4 relative overflow-hidden rounded-b-[2rem] shadow-lg">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center">
          {/* Greeting and Username */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <motion.p 
                className="text-white/90 text-sm font-medium"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                حياكم في
              </motion.p>
              <motion.h1 
                className="text-xl font-bold text-white"
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {storeName}
              </motion.h1>
            </div>
            
            {/* User Avatar */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-xl font-bold text-blue-600 shadow-md border-2 border-white/30">
                {initials}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreBanner;
