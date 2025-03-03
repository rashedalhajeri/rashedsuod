
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Search, Filter, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const Payments: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>تصدير المعاملات</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن معاملة برقم الطلب أو طريقة الدفع..." 
                className="pl-3 pr-10" 
              />
            </div>
          </div>
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              <span>تصفية النتائج</span>
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <CreditCard className="h-4 w-4 inline-block ml-2" />
              سجل المدفوعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">لا توجد مدفوعات بعد</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ستظهر المعاملات هنا عندما يقوم العملاء بالدفع
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
