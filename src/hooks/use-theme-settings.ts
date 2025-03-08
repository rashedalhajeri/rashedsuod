import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * هوك لإدارة إعدادات سمة المتجر
 * @param storeId - معرف المتجر
 */
export const useThemeSettings = (storeId?: string) => {
  const [themeSettings, setThemeSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storeId) {
      fetchThemeSettings(storeId);
    }
  }, [storeId]);

  const fetchThemeSettings = async (storeId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('store_theme_settings')
        .select('*')
        .eq('store_id', storeId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching theme settings:", error);
        toast("خطأ في جلب الإعدادات", {
          description: "لم نتمكن من جلب إعدادات سمة المتجر الخاصة بك."
        });
        return;
      }

      setThemeSettings(data || {});
    } catch (err) {
      console.error("Error in fetchThemeSettings:", err);
      toast("حدث خطأ", {
        description: "حدث خطأ غير متوقع أثناء جلب إعدادات السمة."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeSettings = async (settings: any) => {
    if (!storeId) {
      toast("خطأ", {
        description: "لم يتم العثور على معرف المتجر."
      });
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('store_theme_settings')
        .upsert({
          store_id: storeId,
          ...settings,
        }, { onConflict: 'store_id' })
        .select();

      if (error) {
        console.error("Error saving theme settings:", error);
        toast("خطأ في حفظ الإعدادات", {
          description: "حدث خطأ أثناء حفظ إعدادات السمة."
        });
        return;
      }

      setThemeSettings(data?.[0] || {});
      toast("تم الحفظ", {
        description: "تم حفظ إعدادات السمة بنجاح."
      });
    } catch (err) {
      console.error("Error in saveThemeSettings:", err);
      toast("حدث خطأ", {
        description: "حدث خطأ غير متوقع أثناء حفظ إعدادات السمة."
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    themeSettings,
    isLoading,
    isSaving,
    saveThemeSettings: async (settings: any) => {
      if (!storeId) {
        toast("خطأ", {
          description: "لم يتم العثور على معرف المتجر."
        });
        return;
      }

      setIsSaving(true);
      try {
        const { data, error } = await supabase
          .from('store_theme_settings')
          .upsert({
            store_id: storeId,
            ...settings,
          }, { onConflict: 'store_id' })
          .select();

        if (error) {
          console.error("Error saving theme settings:", error);
          toast("خطأ في حفظ الإعدادات", {
            description: "حدث خطأ أثناء حفظ إعدادات السمة."
          });
          return;
        }

        setThemeSettings(data?.[0] || {});
        toast("تم الحفظ", {
          description: "تم حفظ إعدادات السمة بنجاح."
        });
      } catch (err) {
        console.error("Error in saveThemeSettings:", err);
        toast("حدث خطأ", {
          description: "حدث خطأ غير متوقع أثناء حفظ إعدادات السمة."
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
};
