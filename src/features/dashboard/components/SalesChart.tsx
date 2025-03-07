
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowUpRight, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SalesData {
  name: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesData[];
  currency: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, currency }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // تحويل البيانات لتناسب المخطط
  const chartData = data.length > 0 ? data : [
    { name: "يناير", sales: 0 },
    { name: "فبراير", sales: 0 },
    { name: "مارس", sales: 0 },
    { name: "أبريل", sales: 0 },
    { name: "مايو", sales: 0 },
    { name: "يونيو", sales: 0 }
  ];
  
  // حساب إجمالي المبيعات من البيانات
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-8 shadow-sm border-gray-100 bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-primary-100 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-primary-600" />
            </span>
            نظرة عامة على المبيعات
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${chartType === 'line' ? 'bg-primary-100 text-primary-700' : ''}`}
                onClick={() => setChartType('line')}
              >
                <LineChart size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${chartType === 'bar' ? 'bg-primary-100 text-primary-700' : ''}`}
                onClick={() => setChartType('bar')}
              >
                <BarChart3 size={14} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-900">{currency} {totalSales.toLocaleString()}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/30 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">متوسط قيمة الطلب</p>
              <p className="text-2xl font-bold text-gray-900">{currency} {chartData.length > 0 ? (totalSales / Math.max(1, chartData.length)).toFixed(2) : '0.00'}</p>
            </div>
          </div>
          
          <div className="h-[300px] mt-6 bg-white p-2 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6E59A5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${currency} ${value}`, 'المبيعات']}
                    labelFormatter={(name) => `${name}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#6E59A5" 
                    strokeWidth={2}
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${currency} ${value}`, 'المبيعات']}
                    labelFormatter={(name) => `${name}`}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#6E59A5" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SalesChart;
