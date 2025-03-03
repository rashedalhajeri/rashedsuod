
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Coupons: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الكوبونات</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة كوبون</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن كوبون..." 
                className="pl-3 pr-10" 
              />
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <Tag className="h-4 w-4 inline-block ml-2" />
              قائمة الكوبونات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">لا توجد كوبونات بعد</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                أضف كوبونات خصم لتشجيع العملاء على الشراء
              </p>
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                <span>إضافة أول كوبون</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Coupons;
