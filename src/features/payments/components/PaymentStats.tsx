import React from "react";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentStats } from "@/services/payments";

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
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['paymentStats', storeData?.id],
    queryFn: () => fetchPaymentStats(storeData?.id || ''),
    enabled: !!storeData?.id,
  });
  
  const defaultStats = {
    totalRevenue: 0,
    pendingAmount: 0,
    successRate: 0,
    avgTime: "24 ساعة"
  };
  
  const statsData = stats || defaultStats;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    console.error("Error loading payment stats:", error);
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
      <PaymentStat 
        title="إجمالي الإيرادات"
        value={formatCurrency(statsData.totalRevenue)}
        trend={{ value: 12, isPositive: true }}
        icon={<DollarSign className="h-5 w-5" />}
        iconClassName="bg-green-100 text-green-600"
      />
      
      <PaymentStat 
        title="المبالغ المعلقة"
        value={formatCurrency(statsData.pendingAmount)}
        icon={<Clock className="h-5 w-5" />}
        iconClassName="bg-amber-100 text-amber-600"
      />
      
      <PaymentStat 
        title="معدل النجاح"
        value={`${statsData.successRate}%`}
        trend={{ value: 3, isPositive: true }}
        icon={<TrendingUp className="h-5 w-5" />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      
      <PaymentStat 
        title="متوسط مدة المعالجة"
        value={statsData.avgTime}
        icon={<CreditCard className="h-5 w-5" />}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
};

export default PaymentStats;
