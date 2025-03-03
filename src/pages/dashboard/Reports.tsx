
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Filter, CalendarRange, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Reports: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">تقارير المتجر</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>تصدير التقارير</span>
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>تقرير جديد</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث في التقارير..." 
                className="pl-3 pr-10" 
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 flex-1">
              <Filter className="h-4 w-4" />
              <span>التصفية</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1">
              <CalendarRange className="h-4 w-4" />
              <span>الفترة</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <BarChart3 className="h-4 w-4 inline-block ml-2" />
              تقارير المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">لا توجد تقارير حالياً</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                قم بإنشاء تقارير لتحليل أداء متجرك ومبيعاتك
              </p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                <span>إنشاء أول تقرير</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
