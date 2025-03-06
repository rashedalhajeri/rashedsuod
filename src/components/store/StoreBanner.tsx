
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
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-pattern"></div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {storeName}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-700 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {storeDescription || `متجر ${storeName} الإلكتروني، نوفر لكم أفضل المنتجات`}
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            className="relative max-w-xl mx-auto mt-8 glass-effect rounded-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Input
              type="search"
              placeholder="ابحث عن منتجات..."
              value={searchQuery}
              onChange={onSearchChange}
              className="pr-12 pl-4 py-6 rounded-full border-gray-200 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-base bg-white/70 backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreBanner;
