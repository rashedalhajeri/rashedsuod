import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentChartData } from "@/services/payments";

const PaymentChartCard: React.FC = () => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  const [period, setPeriod] = useState("monthly");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['paymentChartData', storeData?.id, period],
    queryFn: () => fetchPaymentChartData(storeData?.id || '', period),
    enabled: !!storeData?.id,
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md" dir="rtl">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-primary-600 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        dir="rtl"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">تحليل المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">جاري تحميل البيانات...</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  if (error) {
    console.error("Error loading payment chart data:", error);
  }
  
  const chartData = data || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">تحليل المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly" onValueChange={handlePeriodChange}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="daily">يومي</TabsTrigger>
                <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
                <TabsTrigger value="monthly">شهري</TabsTrigger>
              </TabsList>
            </div>
            
            {['daily', 'weekly', 'monthly'].map((periodValue) => (
              <TabsContent key={periodValue} value={periodValue}>
                {chartData.length === 0 ? (
                  <div className="h-72 flex items-center justify-center">
                    <p className="text-gray-500">لا توجد بيانات كافية للعرض</p>
                  </div>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          width={60}
                          tick={{ textAnchor: 'end' }}
                        />
                        <XAxis 
                          type="number"
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentChartCard;
