
import React from "react";
import { AlertCircle, Crown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SubscriptionAlertProps {
  isBasicPlan: boolean;
}

const SubscriptionAlert: React.FC<SubscriptionAlertProps> = ({ isBasicPlan }) => {
  if (!isBasicPlan) {
    return null;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 flex items-start gap-3 overflow-hidden relative"
    >
      <div className="absolute opacity-10 right-0 bottom-0">
        <Crown className="h-32 w-32 text-amber-500" />
      </div>
      
      <div className="p-2 bg-amber-200/50 rounded-full">
        <AlertCircle className="h-5 w-5 text-amber-600" />
      </div>
      
      <div className="flex-1 z-10">
        <h4 className="font-medium text-amber-800 text-base">أنت تستخدم الباقة الأساسية</h4>
        <p className="text-sm text-amber-700 mt-1">
          قم بترقية متجرك إلى الباقة الاحترافية للحصول على المزيد من المميزات المتقدمة والتخصيصات
        </p>
        <div className="mt-3">
          <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none shadow-sm">
            <Link to="/dashboard/settings" className="flex items-center gap-1">
              <span>ترقية الباقة</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionAlert;
