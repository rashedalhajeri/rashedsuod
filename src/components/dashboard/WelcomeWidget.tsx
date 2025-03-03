
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

interface WelcomeWidgetProps {
  storeName: string | null;
  username?: string;
}

const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ storeName, username = "صاحب المتجر" }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "صباح الخير";
    if (hour < 18) return "مساء الخير";
    return "مساء الخير";
  };

  const getDate = () => {
    return new Date().toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-r from-primary-50 to-white border-primary-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{getGreeting()}, {username}</h2>
              <p className="text-gray-600 mb-4">{getDate()}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button variant="outline" className="bg-white/80 hover:bg-white">
                  إضافة منتج جديد
                </Button>
                <Button variant="outline" className="bg-white/80 hover:bg-white">
                  عرض الطلبات الجديدة
                </Button>
              </div>
            </div>
            
            <motion.div 
              className="mt-4 md:mt-0 bg-white/80 p-4 rounded-lg border border-primary-100"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center gap-2 text-primary-600">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">نصيحة اليوم</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">أضف صور عالية الجودة لمنتجاتك لزيادة نسبة المبيعات!</p>
              <Button variant="link" className="text-primary-600 p-0 mt-2 h-auto" size="sm">
                المزيد من النصائح
                <ChevronRight className="mr-1 h-3 w-3" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeWidget;
