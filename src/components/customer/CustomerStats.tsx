
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, RefreshCcw, Award, DollarSign
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerStatsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  loyalCustomers: number;
  averageSpend?: number;
  isLoading?: boolean;
  currencySymbol?: string;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({
  totalCustomers,
  newCustomers,
  returningCustomers,
  loyalCustomers,
  averageSpend = 0,
  isLoading = false,
  currencySymbol = 'ر.س'
}) => {
  const items = [
    {
      title: 'إجمالي العملاء',
      value: totalCustomers,
      icon: <Users className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'عملاء جدد',
      value: newCustomers,
      icon: <UserPlus className="h-4 w-4" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'عملاء عائدون',
      value: returningCustomers,
      icon: <RefreshCcw className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'عملاء مخلصون',
      value: loyalCustomers,
      icon: <Award className="h-4 w-4" />,
      color: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'متوسط الإنفاق',
      value: averageSpend,
      prefix: currencySymbol,
      icon: <DollarSign className="h-4 w-4" />,
      color: 'bg-emerald-100 text-emerald-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {items.map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{item.title}</p>
                  <h4 className="text-2xl font-bold">
                    {item.prefix && <span className="text-base ml-1">{item.prefix}</span>}
                    {item.value}
                  </h4>
                </div>
                <div className={`p-2 rounded-full ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CustomerStats;
