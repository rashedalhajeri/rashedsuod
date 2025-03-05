
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// أنواع البيانات للإعدادات
export interface StoreShippingSettings {
  id?: string;
  store_id: string;
  shipping_method: 'store_delivery' | 'bronze_delivery';
  free_shipping: boolean;
  free_shipping_min_order: number;
  standard_delivery_time: string;
  delivery_time_unit: 'hours' | 'days';
  bronze_delivery_speed: 'standard' | 'express' | 'same_day';
}

export interface DeliveryArea {
  id?: string;
  store_id: string;
  name: string;
  price: number;
  enabled: boolean;
  is_governorate?: boolean; // إضافة حقل لتمييز المحافظات
}

// الحصول على إعدادات الشحن
export const getShippingSettings = async (storeId: string): Promise<StoreShippingSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('store_id', storeId)
      .single();
    
    if (error) {
      console.error("خطأ في جلب إعدادات الشحن:", error);
      return null;
    }
    
    return data as StoreShippingSettings;
  } catch (error) {
    console.error("خطأ في خدمة الشحن:", error);
    return null;
  }
};

// حفظ إعدادات الشحن
export const saveShippingSettings = async (settings: StoreShippingSettings): Promise<boolean> => {
  try {
    // التحقق من وجود إعدادات سابقة
    const { data: existingSettings } = await supabase
      .from('store_settings')
      .select('id')
      .eq('store_id', settings.store_id)
      .single();
    
    let result;
    
    if (existingSettings?.id) {
      // تحديث الإعدادات الموجودة
      result = await supabase
        .from('store_settings')
        .update({
          shipping_method: settings.shipping_method,
          free_shipping: settings.free_shipping,
          free_shipping_min_order: settings.free_shipping_min_order,
          standard_delivery_time: settings.standard_delivery_time,
          delivery_time_unit: settings.delivery_time_unit,
          bronze_delivery_speed: settings.bronze_delivery_speed
        })
        .eq('id', existingSettings.id);
    } else {
      // إنشاء إعدادات جديدة
      result = await supabase
        .from('store_settings')
        .insert([settings]);
    }
    
    if (result.error) {
      console.error("خطأ في حفظ إعدادات الشحن:", result.error);
      toast.error("حدث خطأ في حفظ إعدادات الشحن");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("خطأ في خدمة الشحن:", error);
    toast.error("حدث خطأ في حفظ إعدادات الشحن");
    return false;
  }
};

// الحصول على مناطق التوصيل
export const getDeliveryAreas = async (storeId: string): Promise<DeliveryArea[]> => {
  try {
    const { data, error } = await supabase
      .from('delivery_areas')
      .select('*')
      .eq('store_id', storeId)
      .order('name');
    
    if (error) {
      console.error("خطأ في جلب مناطق التوصيل:", error);
      return [];
    }
    
    return data as DeliveryArea[];
  } catch (error) {
    console.error("خطأ في خدمة الشحن:", error);
    return [];
  }
};

// حفظ مناطق التوصيل
export const saveDeliveryAreas = async (areas: DeliveryArea[]): Promise<boolean> => {
  try {
    if (!areas.length) return true;
    
    const storeId = areas[0].store_id;
    
    // أولاً، حذف جميع المناطق الحالية
    const { error: deleteError } = await supabase
      .from('delivery_areas')
      .delete()
      .eq('store_id', storeId);
    
    if (deleteError) {
      console.error("خطأ في حذف مناطق التوصيل:", deleteError);
      return false;
    }
    
    // ثم إضافة المناطق الجديدة
    const { error: insertError } = await supabase
      .from('delivery_areas')
      .insert(areas);
    
    if (insertError) {
      console.error("خطأ في إضافة مناطق التوصيل:", insertError);
      toast.error("حدث خطأ في حفظ مناطق التوصيل");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("خطأ في خدمة الشحن:", error);
    toast.error("حدث خطأ في حفظ مناطق التوصيل");
    return false;
  }
};

// الحصول على محافظات الكويت
export const getKuwaitGovernorates = (): DeliveryArea[] => {
  // قائمة المحافظات في الكويت مع أسعار التوصيل الافتراضية
  return [
    { name: "العاصمة", price: 2, enabled: true, is_governorate: true },
    { name: "حولي", price: 2, enabled: true, is_governorate: true },
    { name: "الفروانية", price: 3, enabled: true, is_governorate: true },
    { name: "الأحمدي", price: 3, enabled: true, is_governorate: true },
    { name: "الجهراء", price: 4, enabled: true, is_governorate: true },
    { name: "مبارك الكبير", price: 3, enabled: true, is_governorate: true }
  ] as DeliveryArea[];
};

// تطبيق سعر موحد على محافظات محددة
export const applyPriceToSelectedGovernorates = (areas: DeliveryArea[], selectedGovs: string[], price: number): DeliveryArea[] => {
  return areas.map(area => {
    if (area.is_governorate && selectedGovs.includes(area.name)) {
      return { ...area, price };
    }
    return area;
  });
};

// تمكين أو تعطيل محافظات محددة
export const toggleSelectedGovernorates = (areas: DeliveryArea[], selectedGovs: string[], enabled: boolean): DeliveryArea[] => {
  return areas.map(area => {
    if (area.is_governorate && selectedGovs.includes(area.name)) {
      return { ...area, enabled };
    }
    return area;
  });
};
