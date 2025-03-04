
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, ComposedChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, BarChart3, LineChart as LineChartIcon, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// اشكال مختلفة للبيانات حسب الفترة الزمنية
const timeRangeData = {
  weekly: [
    { name: "الأحد", revenue: 1200, orders: 15, visitors: 340 },
    { name: "الإثنين", revenue: 800, orders: 10, visitors: 280 },
    { name: "الثلاثاء", revenue: 1500, orders: 18, visitors: 390 },
    { name: "الأربعاء", revenue: 2200, orders: 23, visitors: 420 },
    { name: "الخميس", revenue: 2800, orders: 30, visitors: 510 },
    { name: "الجمعة", revenue: 1800, orders: 20, visitors: 430 },
    { name: "السبت", revenue: 2000, orders: 21, visitors: 470 }
  ],
  monthly: [
    { name: "يناير", revenue: 8500, orders: 90, visitors: 2700, lastYear: 6200 },
    { name: "فبراير", revenue: 10200, orders: 100, visitors: 3100, lastYear: 7500 },
    { name: "مارس", revenue: 9800, orders: 95, visitors: 3000, lastYear: 8000 },
    { name: "أبريل", revenue: 12500, orders: 120, visitors: 3600, lastYear: 9200 },
    { name: "مايو", revenue: 14200, orders: 140, visitors: 4000, lastYear: 10500 },
    { name: "يونيو", revenue: 15800, orders: 150, visitors: 4300, lastYear: 11200 },
    { name: "يوليو", revenue: 16500, orders: 160, visitors: 4500, lastYear: 12000 }
  ],
  yearly: [
    { name: "2020", revenue: 85000, orders: 950, visitors: 28000, growth: 0 },
    { name: "2021", revenue: 120000, orders: 1200, visitors: 35000, growth: 41 },
    { name: "2022", revenue: 156000, orders: 1500, visitors: 42000, growth: 30 },
    { name: "2023", revenue: 198000, orders: 1800, visitors: 48000, growth: 27 }
  ]
};

interface EnhancedSalesChartProps {
  currency: string;
}

const EnhancedSalesChart: React.FC<EnhancedSalesChartProps> = ({ currency }) => {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [dataType, setDataType] = useState<"revenue" | "orders" | "visitors" | "comparison">("revenue");
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "composed">("bar");
  
  // تحديد البيانات المعروضة بناء على الفترة المحددة
  const data = useMemo(() => timeRangeData[period], [period]);
  
  // مؤشر التوضيح المخصص
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm text-right">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => {
            let valueLabel = '';
            let value = entry.value;
            
            if (entry.dataKey === 'revenue') {
              valueLabel = 'الإيرادات';
              value = new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: currency === 'ر.س' ? 'SAR' : currency
              }).format(value);
            } else if (entry.dataKey === 'orders') {
              valueLabel = 'الطلبات';
              value = `${value} طلب`;
            } else if (entry.dataKey === 'visitors') {
              valueLabel = 'الزيارات';
              value = `${value} زائر`;
            } else if (entry.dataKey === 'lastYear') {
              valueLabel = 'العام الماضي';
              value = new Intl.NumberFormat('ar-SA', {
                style: 'currency',
                currency: currency === 'ر.س' ? 'SAR' : currency
              }).format(value);
            } else if (entry.dataKey === 'growth') {
              valueLabel = 'نسبة النمو';
              value = `${value}%`;
            }
            
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${valueLabel}: ${value}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  // تحديد نوع الرسم البياني بناء على نوع البيانات
  const renderChart = () => {
    if (dataType === 'comparison' && period === 'monthly') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} ${currency}`}
              yAxisId="left"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} ${currency}`}
              orientation="right"
              yAxisId="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
              name="هذا العام" 
              yAxisId="left"
            />
            <Line 
              type="monotone" 
              dataKey="lastYear" 
              stroke="#ff7300" 
              name="العام الماضي"
              strokeWidth={2}
              dot={{ r: 4 }}
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => dataType === 'revenue' ? `${value} ${currency}` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={dataType} 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => dataType === 'revenue' ? `${value} ${currency}` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={dataType} 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => dataType === 'revenue' ? `${value} ${currency}` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataType} fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey={dataType} stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => dataType === 'revenue' ? `${value} ${currency}` : value}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={dataType} 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={500}
              />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-medium">إحصائيات المبيعات والزيارات</CardTitle>
            <CardDescription>تحليل تفصيلي للمبيعات والزيارات</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1 h-8">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs">الفترة</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-64" align="end">
                <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as any)}>
                  <TabsList className="w-full">
                    <TabsTrigger value="weekly" className="flex-1">أسبوعي</TabsTrigger>
                    <TabsTrigger value="monthly" className="flex-1">شهري</TabsTrigger>
                    <TabsTrigger value="yearly" className="flex-1">سنوي</TabsTrigger>
                  </TabsList>
                </Tabs>
              </PopoverContent>
            </Popover>
          
            <Select value={dataType} onValueChange={(value) => setDataType(value as any)}>
              <SelectTrigger className="w-auto h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">الإيرادات</SelectItem>
                <SelectItem value="orders">الطلبات</SelectItem>
                <SelectItem value="visitors">الزيارات</SelectItem>
                {period === 'monthly' && (
                  <SelectItem value="comparison">مقارنة بالعام الماضي</SelectItem>
                )}
              </SelectContent>
            </Select>
            
            <div className="flex bg-gray-100 rounded-md p-0.5 h-8">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 p-0", 
                  chartType === 'bar' && "bg-white shadow-sm rounded"
                )}
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 p-0", 
                  chartType === 'line' && "bg-white shadow-sm rounded"
                )}
                onClick={() => setChartType('line')}
              >
                <LineChartIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-7 w-7 p-0", 
                  chartType === 'area' && "bg-white shadow-sm rounded"
                )}
                onClick={() => setChartType('area')}
              >
                <TrendingUp className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            <Button size="icon" variant="outline" className="h-8 w-8 p-0">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default EnhancedSalesChart;
