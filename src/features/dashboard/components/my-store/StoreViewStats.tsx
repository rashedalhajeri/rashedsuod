
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EyeIcon, ShoppingCart, TrendingUp, User } from "lucide-react";
import useStoreData from "@/hooks/use-store-data";

const StoreViewStats: React.FC = () => {
  const { storeData } = useStoreData();
  
  // Fetch basic store stats
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['storeStats', storeData?.id],
    queryFn: async () => {
      if (!storeData?.id) return null;
      
      try {
        // In a real application, fetch actual visitor stats
        // For now, we're just returning placeholder data
        
        // This would be a real fetch call in a production app
        await new Promise(resolve => setTimeout(resolve, 500)); // Fake loading delay
        
        return {
          views: 128,
          visitors: 82,
          purchases: 14,
          conversionRate: 17.07
        };
      } catch (error) {
        console.error("Error fetching store stats:", error);
        return null;
      }
    },
    enabled: !!storeData?.id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  return (
    <Card className="shadow-md border-none overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-100/80 to-transparent">
        <CardTitle className="text-lg">إحصائيات المتجر</CardTitle>
        <CardDescription>
          ملخص أداء متجرك خلال الـ 30 يوم الماضية
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-3 p-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <EyeIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المشاهدات</p>
              <p className="text-xl font-semibold">
                {isLoading ? "..." : statsData?.views || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الزوار</p>
              <p className="text-xl font-semibold">
                {isLoading ? "..." : statsData?.visitors || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الطلبات</p>
              <p className="text-xl font-semibold">
                {isLoading ? "..." : statsData?.purchases || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">معدل التحويل</p>
              <p className="text-xl font-semibold">
                {isLoading ? "..." : `${statsData?.conversionRate || 0}%`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreViewStats;
