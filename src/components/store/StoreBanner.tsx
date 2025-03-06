
import React from "react";
import { motion } from "framer-motion";
import { ArrowDownToLine, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-media-query";

interface StoreBannerProps {
  storeName: string;
  storeDescription?: string;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoUrl?: string | null;
  bannerUrl?: string | null;
}

const StoreBanner: React.FC<StoreBannerProps> = ({
  storeName,
  storeDescription,
  logoUrl,
  bannerUrl
}) => {
  const isMobile = useIsMobile();
  
  // Return null if no proper banner content exists
  if (!storeName && !storeDescription) {
    return null;
  }
  
  return (
    <div className="relative bg-gradient-to-l from-gray-900 to-gray-800 py-6 px-4 sm:px-5 rounded-xl shadow-md mt-4 mb-6 overflow-hidden border border-gray-700 w-full">
      {/* Fondo con imagen de electrónica */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/20 rounded-full -mt-10 -mr-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-indigo-500/10 rounded-full -mb-8 -ml-8 blur-xl"></div>
      
      <motion.div 
        className="flex items-center justify-between gap-3 sm:gap-4 relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Sección de información */}
        <div className="flex-1 flex flex-col items-end text-right">
          <h3 className="text-blue-400 font-bold text-base sm:text-xl mb-2 flex items-center gap-1 sm:gap-2">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">الإلكترونيات الذكية</span>
          </h3>
          <p className="text-gray-300 mb-3 sm:mb-4 text-xs sm:text-sm max-w-md">
            أحدث الأجهزة والتقنيات العصرية بأفضل الأسعار وخدمة متميزة
          </p>
          
          <div className="flex space-x-2 sm:space-x-3 rtl:space-x-reverse">
            <a 
              href="#" 
              className={cn(
                "group flex flex-col items-center gap-1 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-sm",
                "border border-indigo-100 hover:border-indigo-300 transition-all duration-300",
                "hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <span className="text-[10px] sm:text-xs text-gray-500">GET IT ON</span>
              <span className="font-bold text-indigo-700 group-hover:text-indigo-600 text-xs sm:text-base">Google Play</span>
            </a>
            <a 
              href="#" 
              className={cn(
                "group flex flex-col items-center gap-1 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-sm",
                "border border-indigo-100 hover:border-indigo-300 transition-all duration-300",
                "hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <span className="text-[10px] sm:text-xs text-gray-500">Download on the</span>
              <span className="font-bold text-indigo-700 group-hover:text-indigo-600 text-xs sm:text-base">App Store</span>
            </a>
          </div>
        </div>
        
        {/* Sección de código QR (oculto en móvil) */}
        {!isMobile && (
          <div className="hidden md:flex items-center justify-center bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-white/20">
            <div className="w-24 h-24 bg-gray-100/10 rounded-md flex items-center justify-center">
              <ArrowDownToLine className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Indicadores de puntos */}
      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mt-4 sm:mt-6">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={cn(
              "w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300",
              index === 4 ? "bg-blue-400 w-3 sm:w-4" : "bg-gray-600 hover:bg-gray-500"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StoreBanner;
