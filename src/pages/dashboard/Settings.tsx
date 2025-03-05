
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import useStoreData from "@/hooks/use-store-data";
import { 
  GeneralSettings, 
  PaymentSettings, 
  ShippingSettings, 
  DesignSettings,
  IntegrationsSettings,
  BillingSettings
} from "@/features/dashboard/settings";

type TabsType = 'general' | 'payment' | 'shipping' | 'design' | 'integrations' | 'billing';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState<TabsType>((searchParams.get("tab") as TabsType) || "general");
  
  const { data: storeData, isLoading, error } = useStoreData();
  
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as TabsType;
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);
  
  const handleTabChange = (tab: TabsType) => {
    setActiveTab(tab);
    searchParams.set("tab", tab);
    navigate({ pathname: location.pathname, search: searchParams.toString() });
  };
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p className="text-red-500">حدث خطأ في تحميل بيانات المتجر. يرجى المحاولة مرة أخرى.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p>جاري تحميل بيانات المتجر...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">إعدادات المتجر</h1>
        
        <Tabs defaultValue="general" value={activeTab} className="w-full" onValueChange={(tab) => handleTabChange(tab as TabsType)}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full bg-white border">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="payment">الدفع</TabsTrigger>
            <TabsTrigger value="shipping">الشحن</TabsTrigger>
            <TabsTrigger value="design">التصميم</TabsTrigger>
            <TabsTrigger value="integrations">التكاملات</TabsTrigger>
            <TabsTrigger value="billing">الباقة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings storeData={storeData} />
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentSettings storeData={storeData} />
          </TabsContent>
          
          <TabsContent value="shipping">
            <ShippingSettings storeData={storeData} />
          </TabsContent>
          
          <TabsContent value="design">
            <DesignSettings storeData={storeData} />
          </TabsContent>
          
          <TabsContent value="integrations">
            <IntegrationsSettings />
          </TabsContent>
          
          <TabsContent value="billing">
            <BillingSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
