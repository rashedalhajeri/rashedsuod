
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { ArrowUpRight, BarChart3, LineChart, PieChart as PieChartIcon, Download, Info, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip as UI_Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesData {
  name: string;
  sales: number;
}

interface SalesChartProps {
  data: SalesData[];
  currency: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, currency }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  
  // Process data for charts
  const chartData = data.length > 0 ? data : [
    { name: "يناير", sales: 400 },
    { name: "فبراير", sales: 300 },
    { name: "مارس", sales: 500 },
    { name: "أبريل", sales: 200 },
    { name: "مايو", sales: 600 },
    { name: "يونيو", sales: 450 }
  ];
  
  // Calculate total sales and growth
  const totalSales = chartData.reduce((sum, item) => sum + item.sales, 0);
  const growthRate = 12.8; // Mock growth data
  
  // Colors for pie chart
  const COLORS = ['#6E59A5', '#8B5CF6', '#9333EA', '#A855F7', '#C084FC', '#D8B4FE'];
  
  // Enhancement - Calculate percentage change
  const averageSale = totalSales / chartData.length;
  
  // Handle chart download (mock functionality)
  const handleDownloadChart = () => {
    alert('تم تحميل بيانات المبيعات بنجاح');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-8 shadow-sm border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <span className="h-6 w-6 rounded-lg bg-primary-100 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-primary-600" />
              </span>
              تحليل المبيعات
            </CardTitle>
            <p className="text-sm text-muted-foreground -mt-1">
              مؤشرات أداء المبيعات خلال الفترة الحالية
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              <TooltipProvider>
                <UI_Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${chartType === 'line' ? 'bg-primary-100 text-primary-700' : ''}`}
                      onClick={() => setChartType('line')}
                    >
                      <LineChart size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>عرض خطي</p>
                  </TooltipContent>
                </UI_Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <UI_Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${chartType === 'bar' ? 'bg-primary-100 text-primary-700' : ''}`}
                      onClick={() => setChartType('bar')}
                    >
                      <BarChart3 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>عرض أعمدة</p>
                  </TooltipContent>
                </UI_Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <UI_Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${chartType === 'pie' ? 'bg-primary-100 text-primary-700' : ''}`}
                      onClick={() => setChartType('pie')}
                    >
                      <PieChartIcon size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>عرض دائري</p>
                  </TooltipContent>
                </UI_Tooltip>
              </TooltipProvider>
            </div>
            
            <TooltipProvider>
              <UI_Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-primary-600"
                    onClick={handleDownloadChart}
                  >
                    <Download size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تحميل البيانات</p>
                </TooltipContent>
              </UI_Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-primary-600"
                >
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>عرض التفاصيل الكاملة</DropdownMenuItem>
                <DropdownMenuItem>مقارنة مع الفترة السابقة</DropdownMenuItem>
                <DropdownMenuItem>تصدير إلى Excel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-primary-50 to-primary-100/30 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-gray-900">{currency} {totalSales.toLocaleString()}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 px-2 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {growthRate}%
                </Badge>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100/30 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">متوسط قيمة الطلب</p>
                  <p className="text-2xl font-bold text-gray-900">{currency} {chartData.length > 0 ? (totalSales / Math.max(1, chartData.length)).toFixed(2) : '0.00'}</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-2">
                  {chartData.length} طلبات
                </Badge>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">أعلى قيمة مبيعات</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chartData.length > 0 ? 
                      `${currency} ${Math.max(...chartData.map(item => item.sales)).toLocaleString()}` : 
                      `${currency} 0`
                    }
                  </p>
                </div>
                <div className="flex text-xs text-gray-500 items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  {chartData.reduce((max, item) => item.sales > max.sales ? item : max, chartData[0]).name}
                </div>
              </div>
            </motion.div>
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
                    activeDot={{ r: 6, fill: "#6E59A5", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : chartType === 'bar' ? (
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
              ) : (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="sales"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${currency} ${value}`, 'المبيعات']}
                  />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SalesChart;
