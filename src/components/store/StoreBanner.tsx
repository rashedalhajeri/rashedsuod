
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="bg-gradient-to-r from-blue-700 to-green-500 py-12 px-4 relative overflow-hidden mt-0">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20 bg-pattern"></div>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 -ml-24 -mb-24"></div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <motion.p 
                className="text-white/80 mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                مرحبًا
              </motion.p>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white leading-tight"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {storeName}
              </motion.h1>
            </div>
            
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold text-blue-600">
                {storeName.split(" ").map(word => word[0]).join("")}
              </div>
            </motion.div>
          </div>
          
          {/* Search Bar - Will be shown in navbar instead */}
        </div>
      </motion.div>
    </div>
  );
};

export default StoreBanner;
