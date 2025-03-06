
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentChartData, fetchDailyPaymentTrend } from "@/services/payments";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentChartCard: React.FC = () => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  const [period, setPeriod] = useState("monthly");
  const [view, setView] = useState("bar");
  
  const { data, isLoading } = useQuery({
    queryKey: ['paymentChartData', storeData?.id, period],
    queryFn: () => fetchPaymentChartData(storeData?.id || '', period),
    enabled: !!storeData?.id,
  });
  
  const { data: dailyTrendData, isLoading: isDailyTrendLoading } = useQuery({
    queryKey: ['dailyPaymentTrend', storeData?.id],
    queryFn: () => fetchDailyPaymentTrend(storeData?.id || ''),
    enabled: !!storeData?.id && period === 'hourly',
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg" dir="rtl">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-primary-600 font-bold mt-1">
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
  
  const handleViewChange = (value: string) => {
    setView(value);
  };
  
  if (isLoading || (period === 'hourly' && isDailyTrendLoading)) {
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
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full rounded" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  const chartData = period === 'hourly' ? dailyTrendData : data || [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <CardTitle className="text-lg font-medium">تحليل المدفوعات</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Tabs defaultValue={view} onValueChange={handleViewChange} className="mr-2">
                <TabsList className="h-8">
                  <TabsTrigger value="bar" className="px-2 py-1 text-xs">عمودي</TabsTrigger>
                  <TabsTrigger value="line" className="px-2 py-1 text-xs">خطي</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs defaultValue={period} onValueChange={handlePeriodChange}>
                <TabsList className="h-8">
                  <TabsTrigger value="hourly" className="px-2 py-1 text-xs">يومي</TabsTrigger>
                  <TabsTrigger value="daily" className="px-2 py-1 text-xs">أسبوعي</TabsTrigger>
                  <TabsTrigger value="weekly" className="px-2 py-1 text-xs">شهري</TabsTrigger>
                  <TabsTrigger value="monthly" className="px-2 py-1 text-xs">سنوي</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-gray-500">لا توجد بيانات كافية للعرض</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {view === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ textAnchor: 'middle' }}
                      tickMargin={10}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}`}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ textAnchor: 'middle' }}
                      tickMargin={10}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}`}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentChartCard;
