
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ArrowUpRight, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [periodFilter, setPeriodFilter] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
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
  
  // حساب معدل النمو (قيمة افتراضية)
  const growthRate = 12.5;
  
  const periodOptions = [
    { value: 'day', label: 'اليوم' },
    { value: 'week', label: 'الأسبوع' },
    { value: 'month', label: 'الشهر' },
    { value: 'year', label: 'السنة' }
  ];
  
  return (
    <Card className="mb-8 shadow-sm border-primary-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-primary-100 flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-primary-600" />
          </span>
          نظرة عامة على المبيعات
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-200 overflow-hidden">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriodFilter(option.value as any)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  periodFilter === option.value 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          
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
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
            <p className="text-2xl font-bold">{currency} {totalSales.toLocaleString()}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">معدل النمو</p>
            <p className="text-2xl font-bold flex items-center text-green-600">
              {growthRate}% <ArrowUpRight className="h-4 w-4 mr-1" />
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">متوسط قيمة الطلب</p>
            <p className="text-2xl font-bold">{currency} {(totalSales / Math.max(1, chartData.length)).toFixed(2)}</p>
          </div>
        </div>
        
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
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
                  stroke="#22C55E" 
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
                  fill="#22C55E" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
