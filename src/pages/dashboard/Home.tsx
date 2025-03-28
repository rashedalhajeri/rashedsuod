
import React from "react";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingState from "@/components/ui/loading-state";

// Import components
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import SalesChart from "@/features/dashboard/components/SalesChart";
import DashboardStatsSection from "@/features/dashboard/components/DashboardStatsSection";
import SubscriptionAlert from "@/features/dashboard/components/SubscriptionAlert";
import ActivitySummarySection from "@/features/dashboard/components/ActivitySummarySection";
import DashboardErrorHandler from "@/features/dashboard/components/DashboardErrorHandler";
import SalesChartSkeleton from "@/features/dashboard/components/SalesChartSkeleton";

// Import data fetching hook
import useDashboardData from "@/features/dashboard/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Dashboard Home Page
const DashboardHome: React.FC = () => {
  // Use the custom hook to get all dashboard data
  const {
    storeData,
    userName,
    statsData,
    salesData,
    ordersData,
    productsData,
    isLoading,
    storeError,
    statsError,
    salesError,
    ordersError,
    productsError,
    setPeriod
  } = useDashboardData();
  
  // Handle period changes from the stats section
  const handlePeriodChange = (period: string) => {
    setPeriod(period);
  };
  
  // Handle errors
  const hasErrors = storeError || statsError || salesError || ordersError || productsError;
  if (hasErrors) {
    return (
      <DashboardErrorHandler
        storeError={storeError}
        statsError={statsError}
        salesError={salesError}
        ordersError={ordersError}
        productsError={productsError}
      />
    );
  }
  
  // Format currency based on store settings
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'KWD');
  
  // Subscription plan status
  const subscriptionStatus = storeData?.subscription_plan || "free";
  const isBasicPlan = subscriptionStatus === "basic";

  // Transform salesData to match the expected format if needed
  const formattedSalesData = salesData?.map(item => ({
    name: item.name,
    sales: item.value
  })) || [];
  
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        {/* Welcome Section with Store Logo */}
        <WelcomeSection 
          storeName={storeData?.store_name || "متجرك"} 
          ownerName={userName}
          logoUrl={storeData?.logo_url}
        />
        
        {/* Subscription Alert for Basic Plan */}
        {isBasicPlan && <SubscriptionAlert isBasicPlan={isBasicPlan} />}
        
        {/* Stats Cards with Period Selector */}
        <DashboardStatsSection 
          stats={statsData || {
            products: 0,
            orders: 0,
            customers: 0,
            revenue: 0
          }} 
          formatCurrency={formatCurrency}
          onPeriodChange={handlePeriodChange}
          isLoading={isLoading && !statsData}
        />
        
        {/* Sales Chart with Skeleton */}
        {isLoading && !salesData ? (
          <SalesChartSkeleton />
        ) : (
          <SalesChart 
            data={formattedSalesData}
            currency={storeData?.currency || "د.ك"}
          />
        )}
        
        {/* Activity Summary Section with Skeleton */}
        {isLoading && (!ordersData || !productsData) ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                {[1, 2, 3].map(i => (
                  <Skeleton key={`order-${i}`} className="h-16 w-full mb-2" />
                ))}
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-3" />
                {[1, 2, 3].map(i => (
                  <Skeleton key={`product-${i}`} className="h-16 w-full mb-2" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ActivitySummarySection
            orders={ordersData?.orders || []}
            products={productsData || []}
            currency={storeData?.currency || "KWD"}
          />
        )}
        
        {/* Report Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">تقارير المتجر</h3>
              <p className="text-sm text-gray-500">قم بتحميل تقارير مفصلة عن أداء متجرك</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="text-sm h-9 gap-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                <ArrowDownToLine className="h-4 w-4" />
                تقرير المبيعات
              </Button>
              
              <Button variant="outline" className="text-sm h-9 gap-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                <ArrowDownToLine className="h-4 w-4" />
                تقرير المنتجات
              </Button>
              
              <Button variant="outline" className="text-sm h-9 gap-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200">
                <ArrowDownToLine className="h-4 w-4" />
                تقرير العملاء
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
