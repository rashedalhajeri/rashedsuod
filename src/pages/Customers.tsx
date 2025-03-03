
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { UserPlus } from "lucide-react";

const Customers = () => {
  const { toast } = useToast();
  
  const handleAddCustomer = () => {
    toast({
      title: "قريباً",
      description: "ستتمكن من إضافة عملاء جدد قريباً",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">العملاء</h2>
            <p className="text-muted-foreground">
              إدارة قاعدة عملائك وتتبع تفاعلاتهم
            </p>
          </div>
          <Button onClick={handleAddCustomer} className="md:self-end">
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>
        
        <CustomerStats
          totalCustomers={145}
          newCustomers={24}
          returningCustomers={89}
          loyalCustomers={32}
          currencySymbol="ر.س"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>قائمة العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">جميع العملاء</TabsTrigger>
                <TabsTrigger value="new">عملاء جدد</TabsTrigger>
                <TabsTrigger value="vip">كبار العملاء</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="text-center p-8">
                  <p>سيتم إضافة قائمة العملاء قريباً</p>
                </div>
              </TabsContent>
              <TabsContent value="new">
                <div className="text-center p-8">
                  <p>سيتم إضافة قائمة العملاء الجدد قريباً</p>
                </div>
              </TabsContent>
              <TabsContent value="vip">
                <div className="text-center p-8">
                  <p>سيتم إضافة قائمة كبار العملاء قريباً</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
