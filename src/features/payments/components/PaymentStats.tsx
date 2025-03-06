
import React from "react";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Clock, RefreshCcw, CreditCardIcon } from "lucide-react";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentStats, fetchPaymentTrends } from "@/services/payments";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${iconClassName || 'bg-primary-100 text-primary-600'}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const PaymentStats: React.FC = () => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['paymentStats', storeData?.id],
    queryFn: () => fetchPaymentStats(storeData?.id || ''),
    enabled: !!storeData?.id,
  });
  
  const { data: trends, isLoading: isTrendsLoading } = useQuery({
    queryKey: ['paymentTrends', storeData?.id],
    queryFn: () => fetchPaymentTrends(storeData?.id || ''),
    enabled: !!storeData?.id,
  });
  
  const isLoading = isStatsLoading || isTrendsLoading;
  
  const defaultStats = {
    totalRevenue: 0,
    pendingAmount: 0,
    refundedAmount: 0,
    successRate: 0,
    avgTransactionValue: 0,
    avgTime: "24 ساعة"
  };
  
  const statsData = stats || defaultStats;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" dir="rtl">
      <PaymentStat 
        title="إجمالي الإيرادات"
        value={formatCurrency(statsData.totalRevenue)}
        trend={trends?.revenue}
        icon={<DollarSign className="h-6 w-6" />}
        iconClassName="bg-green-100 text-green-600"
      />
      
      <PaymentStat 
        title="المبالغ المعلقة"
        value={formatCurrency(statsData.pendingAmount)}
        icon={<Clock className="h-6 w-6" />}
        iconClassName="bg-amber-100 text-amber-600"
      />
      
      <PaymentStat 
        title="معدل النجاح"
        value={`${statsData.successRate}%`}
        trend={trends?.successRate}
        icon={<TrendingUp className="h-6 w-6" />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      
      {statsData.refundedAmount !== undefined ? (
        <PaymentStat 
          title="المبالغ المستردة"
          value={formatCurrency(statsData.refundedAmount)}
          icon={<RefreshCcw className="h-6 w-6" />}
          iconClassName="bg-red-100 text-red-600"
        />
      ) : (
        <PaymentStat 
          title="متوسط مدة المعالجة"
          value={statsData.avgTime}
          icon={<CreditCard className="h-6 w-6" />}
          iconClassName="bg-purple-100 text-purple-600"
        />
      )}
    </div>
  );
};

export default PaymentStats;
