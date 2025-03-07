
import React from "react";
import { motion } from "framer-motion";
import { CalendarCheck2, Store } from "lucide-react";

interface WelcomeSectionProps {
  storeName: string;
  ownerName?: string;
  logoUrl?: string | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  storeName, 
  ownerName = "المدير", 
  logoUrl
}) => {
  const today = new Date();
  const timeOfDay = getTimeOfDay();
  const formattedDate = formatArabicDate(today);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Store Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`${storeName} logo`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/store-placeholder.svg';
                }}
              />
            ) : (
              <Store className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Greeting & Date */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {timeOfDay} {ownerName} 👋
          </h2>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <CalendarCheck2 className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <p className="mt-2 text-gray-600">
            مرحباً بك في لوحة تحكم متجرك <span className="font-medium text-primary-600">{storeName}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions for date and time formatting
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "صباح الخير،";
  if (hour >= 12 && hour < 17) return "ظهر سعيد،";
  if (hour >= 17 && hour < 21) return "مساء الخير،";
  return "مساء سعيد،";
}

function formatArabicDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('ar-EG', options);
}

export default WelcomeSection;
