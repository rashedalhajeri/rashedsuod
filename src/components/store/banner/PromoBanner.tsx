
import React from "react";
import { motion } from "framer-motion";

interface PromoBannerProps {
  imagePath?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
  imagePath = "/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-gradient-to-l from-blue-500 to-blue-600 py-6 px-4 sm:px-5 rounded-xl shadow-md mt-4 mb-6 overflow-hidden border border-blue-100/80 w-full"
    >
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-300/20 rounded-full -mt-10 -mr-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-blue-400/10 rounded-full -mb-8 -ml-8 blur-xl"></div>
      
      <div className="flex items-center justify-between gap-3 sm:gap-4 relative w-full">
        <div className="flex-1 flex flex-col items-end text-right">
          <h3 className="text-white font-bold text-lg sm:text-2xl mb-2 flex items-center gap-1 sm:gap-2">
            مع تطبيق KIB Paytally
          </h3>
          <p className="text-white/80 mb-3 sm:mb-4 text-sm sm:text-base max-w-md">
            تسوّق، قسّط وتتبّع حالة طلبك بسهولة
          </p>
        </div>
        
        <div className="hidden md:block w-32 h-32 bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
          <img src={imagePath} alt="Promo" className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mt-4 sm:mt-6">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === 3 ? "bg-white w-3 sm:w-4" : "bg-white/50 hover:bg-white/60"
            }`}
          ></div>
        ))}
      </div>
    </motion.div>
  );
};

export default PromoBanner;
