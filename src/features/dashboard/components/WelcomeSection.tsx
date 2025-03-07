
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StorePreviewButton from "./StorePreviewButton";

interface WelcomeSectionProps {
  storeName: string;
  ownerName: string;
  newOrdersCount: number;
  lowStockCount: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  storeName,
  ownerName,
  newOrdersCount,
  lowStockCount
}) => {
  const currentHour = new Date().getHours();
  
  let greeting = "مرحباً";
  if (currentHour < 12) {
    greeting = "صباح الخير";
  } else if (currentHour < 18) {
    greeting = "مساء الخير";
  } else {
    greeting = "مساء الخير";
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-primary-50/80 to-primary-100/50 border-primary-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-300/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {greeting}
                  <Sparkles className="h-5 w-5 text-primary-500 animate-pulse" />
                </h2>
                <p className="text-muted-foreground mt-1 flex items-center">
                  {storeName}
                </p>
              </div>
            </div>
            
            {/* Add Store Preview Button */}
            <StorePreviewButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {newOrdersCount > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-50 flex items-center hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-bold">{newOrdersCount}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">طلبات جديدة</p>
                  <p className="text-xs text-muted-foreground">
                    لديك {newOrdersCount} طلبات تحتاج للمراجعة
                  </p>
                </div>
              </div>
            )}
            
            {lowStockCount > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-50 flex items-center hover:shadow-md transition-all">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">{lowStockCount}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">منتجات قاربت على النفاد</p>
                  <p className="text-xs text-muted-foreground">
                    {lowStockCount} منتجات بحاجة لإعادة التخزين
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeSection;
