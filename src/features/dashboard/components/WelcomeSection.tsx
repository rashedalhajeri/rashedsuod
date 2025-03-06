
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <Card className="bg-gradient-to-r from-primary-50/80 to-primary-100/50 border-primary-100">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {greeting}, {ownerName}
                <Sparkles className="h-5 w-5 mr-2 text-primary-500" />
              </h2>
              <p className="text-muted-foreground mt-1">
                مرحباً بك في لوحة تحكم {storeName}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {newOrdersCount > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border flex items-center">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-bold">{newOrdersCount}</span>
                </div>
                <div>
                  <p className="font-medium">طلبات جديدة</p>
                  <p className="text-xs text-muted-foreground">
                    لديك {newOrdersCount} طلبات تحتاج للمراجعة
                  </p>
                </div>
              </div>
            )}
            
            {lowStockCount > 0 && (
              <div className="bg-white rounded-md p-3 shadow-sm border flex items-center">
                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold">{lowStockCount}</span>
                </div>
                <div>
                  <p className="font-medium">منتجات قاربت على النفاد</p>
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
