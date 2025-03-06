
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import SettingsTabs from "@/features/dashboard/components/SettingsTabs";
import useStoreData from "@/hooks/use-store-data";

const Settings = () => {
  const { storeData, isLoading, error } = useStoreData();
  
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
        <SettingsTabs storeData={storeData} />
      </div>
    </DashboardLayout>
  );
};

export default Settings;
