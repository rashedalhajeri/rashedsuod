import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { motion } from "framer-motion";

interface PaymentStatProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  iconClassName?: string;
}

const PaymentStat: React.FC<PaymentStatProps> = ({
  title,
  value,
  trend,
  icon,
  iconClassName
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all"
      dir="rtl"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          
          {trend && (
            <p className={`text-xs flex items-center mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? 
                <TrendingUp className="h-3 w-3 ml-1" /> : 
                <TrendingDown className="h-3 w-3 ml-1" />
              }
              <span>{trend.value}% {trend.isPositive ? 'زيادة' : 'انخفاض'}</span>
            </p>
          )}
        </div>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconClassName || 'bg-primary-100 text-primary-600'}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const PaymentStats: React.FC = () => {
  const { storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter('KWD');
  
  // يمكن استبدال هذه البيانات بالبيانات الفعلية من قاعدة البيانات
  const stats = {
    totalRevenue: 12500,
    pendingAmount: 2300,
    successRate: 94,
    avgTime: "24 ساعة"
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
      <PaymentStat 
        title="إجمالي الإيرادات"
        value={formatCurrency(stats.totalRevenue)}
        trend={{ value: 12, isPositive: true }}
        icon={<DollarSign className="h-5 w-5" />}
        iconClassName="bg-green-100 text-green-600"
      />
      
      <PaymentStat 
        title="المبالغ المعلقة"
        value={formatCurrency(stats.pendingAmount)}
        icon={<Clock className="h-5 w-5" />}
        iconClassName="bg-amber-100 text-amber-600"
      />
      
      <PaymentStat 
        title="معدل النجاح"
        value={`${stats.successRate}%`}
        trend={{ value: 3, isPositive: true }}
        icon={<TrendingUp className="h-5 w-5" />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      
      <PaymentStat 
        title="متوسط مدة المعالجة"
        value={stats.avgTime}
        icon={<CreditCard className="h-5 w-5" />}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
};

export default PaymentStats;
