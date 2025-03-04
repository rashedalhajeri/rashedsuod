
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useStoreData, getCurrencyFormatter } from "@/hooks/use-store-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ChartData {
  name: string;
  value: number;
}

// بيانات افتراضية للرسم البياني، يمكن استبدالها بالبيانات الفعلية من قاعدة البيانات
const dailyData: ChartData[] = [
  { name: "السبت", value: 1200 },
  { name: "الأحد", value: 1800 },
  { name: "الاثنين", value: 1400 },
  { name: "الثلاثاء", value: 2200 },
  { name: "الأربعاء", value: 1100 },
  { name: "الخميس", value: 1600 },
  { name: "الجمعة", value: 2100 },
];

const weeklyData: ChartData[] = [
  { name: "الأسبوع 1", value: 5800 },
  { name: "الأسبوع 2", value: 6200 },
  { name: "الأسبوع 3", value: 5400 },
  { name: "الأسبوع 4", value: 7200 },
];

const monthlyData: ChartData[] = [
  { name: "يناير", value: 25000 },
  { name: "فبراير", value: 22000 },
  { name: "مارس", value: 28000 },
  { name: "أبريل", value: 24000 },
  { name: "مايو", value: 30000 },
  { name: "يونيو", value: 27000 },
];

const PaymentChartCard: React.FC = () => {
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
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
          <Tabs defaultValue="daily">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="daily">يومي</TabsTrigger>
                <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
                <TabsTrigger value="monthly">شهري</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="daily">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} layout="vertical">
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
            </TabsContent>
            
            <TabsContent value="weekly">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} layout="vertical">
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
            </TabsContent>
            
            <TabsContent value="monthly">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} layout="vertical">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentChartCard;
