
import React from "react";
import { motion } from "framer-motion";

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
  logoUrl
}) => {
  return (
    <div className="bg-white py-6 px-4 rounded-lg shadow-sm mt-4 mb-6">
      <motion.div 
        className="flex flex-col items-center justify-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* App Download Section */}
        <div className="flex flex-col items-end text-right w-full mb-4">
          <h3 className="text-blue-600 font-bold text-xl mb-2">حمل التطبيق الآن</h3>
          <p className="text-gray-600 mb-3 text-sm">
            أكبر منصة للخدمات الطبية والصحية والعلاجية في الكويت
          </p>
          
          <h4 className="text-blue-600 font-medium mb-3">حمل تطبيق المتجر</h4>
          
          <div className="flex space-x-3 rtl:space-x-reverse">
            <a href="#" className="inline-block border border-blue-500 text-blue-600 rounded-md py-2 px-3 text-xs font-medium">
              GET IT ON<br />
              <span className="font-bold">Google Play</span>
            </a>
            <a href="#" className="inline-block border border-blue-500 text-blue-600 rounded-md py-2 px-3 text-xs font-medium">
              Download on the<br />
              <span className="font-bold">App Store</span>
            </a>
          </div>
        </div>
        
        {/* Indicator Dots */}
        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreBanner;
