
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getStoreUrl } from "@/utils/url-utils";

interface WelcomeSectionProps {
  storeName: string;
  ownerName: string;
  newOrdersCount: number;
  lowStockCount: number;
  storeUrl?: string;
  storeId?: string;
  storeDomain?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  storeName,
  ownerName,
  newOrdersCount,
  lowStockCount,
  storeUrl,
  storeId,
  storeDomain
}) => {
  const currentHour = new Date().getHours();
  const [copying, setCopying] = useState(false);
  
  let greeting = "مرحباً";
  if (currentHour < 12) {
    greeting = "صباح الخير";
  } else if (currentHour < 18) {
    greeting = "مساء الخير";
  } else {
    greeting = "مساء الخير";
  }
  
  // Generate store URL using the utility function with proper domain name
  const finalStoreUrl = storeUrl || getStoreUrl({ 
    id: storeId,
    domain_name: storeDomain
  });
  
  // Copy store link to clipboard
  const copyStoreLink = () => {
    if (!finalStoreUrl) return;
    
    setCopying(true);
    
    navigator.clipboard.writeText(finalStoreUrl)
      .then(() => {
        toast.success("تم نسخ رابط المتجر بنجاح");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("حدث خطأ أثناء نسخ الرابط");
      })
      .finally(() => {
        setTimeout(() => setCopying(false), 1000);
      });
  };
  
  // Navigate to store - uses window.open to ensure proper domain navigation
  const visitStore = () => {
    if (!finalStoreUrl) {
      toast.error("لا يمكن الوصول إلى رابط المتجر");
      return;
    }
    
    window.open(finalStoreUrl, '_blank');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-r from-primary-50/80 to-primary-100/50 border-primary-100">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                {greeting}, {ownerName}
                <Sparkles className="h-5 w-5 mr-2 text-primary-500" />
              </h2>
              <p className="text-muted-foreground mt-1">
                مرحباً بك في لوحة تحكم {storeName}
              </p>
            </div>
            
            {finalStoreUrl && (
              <div className="flex gap-2 mr-auto ml-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white hover:bg-primary-50 gap-1.5"
                  onClick={copyStoreLink}
                >
                  <Copy className="h-4 w-4" />
                  <span>{copying ? "تم النسخ!" : "نسخ الرابط"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-primary-50 gap-1.5"
                  onClick={visitStore}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>مشاهدة متجري</span>
                </Button>
              </div>
            )}
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
