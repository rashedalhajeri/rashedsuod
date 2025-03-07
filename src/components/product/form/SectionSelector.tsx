
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const { data: sections = [], isLoading } = useQuery({
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
        return [];
      }
      
      return data || [];
    },
    enabled: !!storeId,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="section">القسم</Label>
      <Select 
        value={sectionId || "none"} 
        onValueChange={onSectionChange}
        disabled={isLoading}
      >
        <SelectTrigger id="section">
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
      {isLoading && <p className="text-xs text-muted-foreground">جاري تحميل الأقسام...</p>}
    </div>
  );
};

export default SectionSelector;
