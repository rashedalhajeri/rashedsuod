
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { fetchThemeSettings } from "@/features/dashboard/services/theme-service";
import useStoreData from "@/hooks/use-store-data";
import DesignTab from "@/features/dashboard/components/tabs/DesignTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from "lucide-react";

const StoreDesign = () => {
  const { storeData } = useStoreData();
  const storeId = storeData?.id;

  const { data: themeSettings, isLoading } = useQuery({
    queryKey: ["themeSettings", storeId],
    queryFn: () => fetchThemeSettings(storeId || ""),
    enabled: !!storeId,
  });

  return (
    <DashboardLayout>
      <Helmet>
        <title>تصميم المتجر | لوحة التحكم</title>
      </Helmet>

      <div className="container mx-auto p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8 text-primary" />
            تصميم المتجر
          </h1>
          <p className="text-gray-500 mt-2">
            قم بتخصيص مظهر متجرك وتصميمه بما يناسب علامتك التجارية
          </p>
        </header>

        <div className="grid gap-6">
          <DesignTab storeId={storeId} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDesign;
