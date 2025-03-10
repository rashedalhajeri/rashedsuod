
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralTab from "./tabs/GeneralTab";
import PaymentTab from "./tabs/PaymentTab";
import ShippingTab from "./tabs/ShippingTab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import BillingTab from "./tabs/BillingTab";
import StoreTab from "./tabs/StoreTab";

type TabsType = 'general' | 'store' | 'payment' | 'shipping' | 'integrations' | 'billing';

interface SettingsTabsProps {
  storeData: any;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ storeData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState<TabsType>((searchParams.get("tab") as TabsType) || "general");
  
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
  
  const subscriptionType = storeData?.subscription_plan || "free";
  const isPaidPlan = subscriptionType !== "free";
  
  return (
    <Tabs defaultValue="general" value={activeTab} className="w-full" onValueChange={(tab) => handleTabChange(tab as TabsType)}>
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full bg-white border">
        <TabsTrigger value="general">عام</TabsTrigger>
        <TabsTrigger value="store">المتجر</TabsTrigger>
        <TabsTrigger value="payment">الدفع</TabsTrigger>
        <TabsTrigger value="shipping">الشحن</TabsTrigger>
        <TabsTrigger value="integrations">التكاملات</TabsTrigger>
        <TabsTrigger value="billing">الباقة</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <GeneralTab storeData={storeData} />
      </TabsContent>
      
      <TabsContent value="store">
        <StoreTab storeData={storeData} />
      </TabsContent>
      
      <TabsContent value="payment">
        <PaymentTab isPaidPlan={isPaidPlan} />
      </TabsContent>
      
      <TabsContent value="shipping">
        <ShippingTab isPaidPlan={isPaidPlan} />
      </TabsContent>
      
      <TabsContent value="integrations">
        <IntegrationsTab />
      </TabsContent>
      
      <TabsContent value="billing">
        <BillingTab />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
