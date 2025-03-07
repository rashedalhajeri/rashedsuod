
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LayoutGrid, Loader2 } from "lucide-react";

interface SectionSelectorProps {
  sectionId: string | null;
  storeId?: string;
  onSectionChange: (sectionId: string) => void;
}

const SectionSelector: React.FC<SectionSelectorProps> = ({
  sectionId,
  storeId,
  onSectionChange
}) => {
  // استخدام useQuery لجلب الأقسام من قاعدة البيانات
  const { 
    data: sections = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['sections', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      console.log("Fetching sections for store ID:", storeId);
      
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
        
      if (error) {
        console.error("Error fetching sections:", error);
        throw new Error(error.message);
      }
      
      console.log("Fetched sections:", data?.length || 0);
      return data || [];
    },
    enabled: !!storeId,
  });

  // إعادة محاولة جلب الأقسام عند تغير storeId
  useEffect(() => {
    if (storeId) {
      refetch();
    }
  }, [storeId, refetch]);

  if (error) {
    console.error("Error loading sections:", error);
  }

  const selectedValue = sectionId || "none";

  return (
    <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <LayoutGrid className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-medium">قسم المنتج</h3>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="section">اختر القسم المناسب للمنتج</Label>
        <Select 
          value={selectedValue} 
          onValueChange={onSectionChange}
          disabled={isLoading}
        >
          <SelectTrigger id="section" className="border-gray-200">
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون قسم</SelectItem>
            {sections.map((section: any) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>جاري تحميل الأقسام...</span>
          </div>
        )}
        
        {error && (
          <p className="text-xs text-red-500">حدث خطأ أثناء تحميل الأقسام</p>
        )}
        
        {!isLoading && !error && sections.length === 0 && (
          <p className="text-xs text-gray-500">لا توجد أقسام متاحة. يمكنك إضافة أقسام جديدة من قسم الأقسام</p>
        )}
      </div>
    </div>
  );
};

export default SectionSelector;
