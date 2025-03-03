
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, RefreshCcw, Award
} from 'lucide-react';

interface CustomerStatsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  loyalCustomers: number;
  currencySymbol?: string;
}

export const CustomerStats: React.FC<CustomerStatsProps> = ({
  totalCustomers,
  newCustomers,
  returningCustomers,
  loyalCustomers,
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
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  <h4 className="text-2xl font-bold">{item.value}</h4>
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
