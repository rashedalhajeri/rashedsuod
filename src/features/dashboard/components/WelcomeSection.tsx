
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Store, ExternalLink, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StorePreviewButton from "./StorePreviewButton";
import { Badge } from "@/components/ui/badge";

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
  let greeting2 = "بك مجدداً";
  if (currentHour < 12) {
    greeting = "صباح الخير";
    greeting2 = "يوم موفق";
  } else if (currentHour < 18) {
    greeting = "مساء الخير";
    greeting2 = "نهار سعيد";
  } else {
    greeting = "مساء الخير";
    greeting2 = "ليلة طيبة";
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-primary-50/80 to-primary-100/50 border-primary-100 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-200/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-300/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <Store className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                  {greeting}
                  <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                </h2>
                <p className="text-muted-foreground mt-1 flex items-center text-gray-700">
                  {storeName} <span className="mx-1 text-xs">•</span> <span className="text-xs text-gray-500">{greeting2}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {newOrdersCount > 0 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 transition-colors duration-200 py-1.5 gap-1.5">
                    <Bell className="h-3.5 w-3.5" />
                    {newOrdersCount} طلبات جديدة
                  </Badge>
                </motion.div>
              )}
              <StorePreviewButton />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {newOrdersCount > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-50 flex items-center hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mr-3 group-hover:bg-orange-100 transition-colors">
                  <span className="text-orange-600 font-bold text-lg">{newOrdersCount}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-1.5">
                    طلبات تحتاج للمراجعة
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-primary-500 cursor-pointer" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    يوجد {newOrdersCount} طلبات جديدة في انتظار المراجعة
                  </p>
                </div>
              </motion.div>
            )}
            
            {lowStockCount > 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-50 flex items-center hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <span className="text-red-600 font-bold text-lg">{lowStockCount}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-1.5">
                    منتجات قاربت على النفاد
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 hover:text-primary-500 cursor-pointer" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lowStockCount} منتجات بحاجة إلى إعادة التخزين
                  </p>
                </div>
              </motion.div>
            )}

            {newOrdersCount === 0 && lowStockCount === 0 && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-primary-50 col-span-2 flex items-center justify-center hover:shadow-md transition-all group text-center py-8"
              >
                <div>
                  <div className="mx-auto h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                    <Sparkles className="h-7 w-7 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">كل شيء على ما يرام!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ليس لديك أي إشعارات أو تنبيهات حالياً
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeSection;
