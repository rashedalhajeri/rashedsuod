
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layers, Loader2 } from "lucide-react";

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

  // الحصول على معلومات القسم المحدد إن وجد
  const selectedSection = sections.find((section: any) => section.id === sectionId);
  const sectionTypeText = selectedSection ? (() => {
    switch (selectedSection.section_type) {
      case 'best_selling': return 'الأكثر مبيعاً';
      case 'new_arrivals': return 'وصل حديثاً';
      case 'featured': return 'منتجات مميزة';
      case 'on_sale': return 'تخفيضات';
      case 'category': return 'فئة محددة';
      case 'custom': return 'منتجات مخصصة';
      default: return selectedSection.section_type;
    }
  })() : '';

  return (
    <div className="space-y-2 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-medium">قسم المنتج</h3>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="section">اختر القسم المناسب للمنتج</Label>
        <Select 
          value={sectionId || "none"} 
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
          <p className="text-xs text-gray-500">لا توجد أقسام متاحة. يمكنك إضافة أقسام جديدة من قسم إدارة الأقسام</p>
        )}
        
        {sectionId && sectionId !== "none" && sectionTypeText && (
          <div className="mt-2 bg-blue-50 border border-blue-100 rounded-md p-3 text-sm text-blue-700">
            <p>نوع القسم: <span className="font-semibold">{sectionTypeText}</span></p>
            <p className="text-xs mt-1">المنتج سيظهر في هذا القسم فقط وفي الصفحة الرئيسية</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionSelector;
