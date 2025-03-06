
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type PlatformStats = {
  id: string;
  total_stores: number;
  active_stores: number;
  suspended_stores: number;
  total_orders: number;
  total_revenue: number;
  updated_at: string;
};

export const usePlatformStats = () => {
  const fetchPlatformStats = async (): Promise<PlatformStats> => {
    const { data, error } = await supabase
      .from('platform_stats')
      .select('*')
      .limit(1)
      .single();
      
    if (error) {
      console.error("خطأ في جلب إحصائيات المنصة:", error);
      throw new Error("فشل في جلب إحصائيات المنصة");
    }
    
    return data as PlatformStats;
  };
  
  return useQuery({
    queryKey: ['platformStats'],
    queryFn: fetchPlatformStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("خطأ في جلب إحصائيات المنصة:", error);
        toast.error("حدث خطأ في جلب إحصائيات المنصة");
      }
    }
  });
};

export default usePlatformStats;
