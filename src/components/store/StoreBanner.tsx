
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoreBannerProps {
  storeName: string;
  storeDescription?: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoUrl?: string | null;
}

const StoreBanner: React.FC<StoreBannerProps> = ({
  storeName,
  storeDescription,
  searchQuery,
  onSearchChange,
  logoUrl
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
    <div className="bg-gradient-to-r from-blue-700 to-green-500 py-10 px-4 relative overflow-hidden rounded-b-[2rem] shadow-lg">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      
      <motion.div 
        className="container mx-auto relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Store Logo */}
          <motion.div
            className="mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Avatar className="h-24 w-24 border-4 border-white/30 shadow-xl">
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt={storeName} />
              ) : (
                <AvatarFallback className="bg-white text-blue-600 text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </motion.div>
          
          {/* Store Name & Welcome */}
          <div className="text-center">
            <motion.p 
              className="text-white/90 text-sm font-medium mb-1"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              حياكم في
            </motion.p>
            <motion.h1 
              className="text-3xl font-bold text-white tracking-wide"
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {storeName}
            </motion.h1>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreBanner;
