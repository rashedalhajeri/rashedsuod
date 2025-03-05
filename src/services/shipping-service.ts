
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// جلب إعدادات الشحن للمتجر
export const fetchShippingSettings = async (storeId: string) => {
  try {
    // جلب إعدادات الشحن الأساسية
    const { data: shippingData, error: shippingError } = await supabase
      .from('store_settings')
      .select('shipping_method, free_shipping_min_order, standard_delivery_time')
      .eq('store_id', storeId)
      .single();
      
    if (shippingError && shippingError.code !== 'PGRST116') {
      console.error("خطأ في جلب إعدادات الشحن:", shippingError);
      return { 
        shippingMethod: 'store', // الافتراضي: توصيل المتجر
        freeShippingMinOrder: 100,
        standardDeliveryTime: 3,
        deliveryAreas: []
      };
    }
    
    // جلب مناطق التوصيل
    const { data: areasData, error: areasError } = await supabase
      .from('delivery_areas')
      .select('*')
      .eq('store_id', storeId);
      
    if (areasError) {
      console.error("خطأ في جلب مناطق التوصيل:", areasError);
      return { 
        shippingMethod: shippingData?.shipping_method || 'store',
        freeShippingMinOrder: shippingData?.free_shipping_min_order || 100,
        standardDeliveryTime: shippingData?.standard_delivery_time || 3,
        deliveryAreas: []
      };
    }
    
    return {
      shippingMethod: shippingData?.shipping_method || 'store',
      freeShippingMinOrder: shippingData?.free_shipping_min_order || 100,
      standardDeliveryTime: shippingData?.standard_delivery_time || 3,
      deliveryAreas: areasData || []
    };
  } catch (error) {
    console.error("Error fetching shipping settings:", error);
    toast.error("حدث خطأ أثناء جلب إعدادات الشحن");
    return { 
      shippingMethod: 'store',
      freeShippingMinOrder: 100,
      standardDeliveryTime: 3,
      deliveryAreas: []
    };
  }
};

// حفظ إعدادات الشحن
export const saveShippingSettings = async (
  storeId: string,
  shippingMethod: 'store' | 'bronze',
  settings: {
    freeShippingMinOrder?: number,
    standardDeliveryTime?: number,
    bronzeDeliverySpeed?: string,
    deliveryAreas?: {
      id: string,
      name: string,
      price: number,
      isEnabled: boolean
    }[]
  }
) => {
  try {
    // 1. حفظ الإعدادات الأساسية
    const { error: settingsError } = await supabase
      .from('store_settings')
      .upsert({
        store_id: storeId,
        shipping_method: shippingMethod,
        free_shipping_min_order: settings.freeShippingMinOrder,
        standard_delivery_time: settings.standardDeliveryTime,
        bronze_delivery_speed: settings.bronzeDeliverySpeed
      }, {
        onConflict: 'store_id'
      });
      
    if (settingsError) throw settingsError;
    
    // 2. حفظ مناطق التوصيل (فقط لطريقة توصيل المتجر)
    if (shippingMethod === 'store' && settings.deliveryAreas) {
      // حذف المناطق القديمة
      const { error: deleteError } = await supabase
        .from('delivery_areas')
        .delete()
        .eq('store_id', storeId);
        
      if (deleteError) throw deleteError;
      
      // إضافة المناطق الجديدة
      const areasToInsert = settings.deliveryAreas
        .filter(area => area.isEnabled)
        .map(area => ({
          store_id: storeId,
          name: area.name,
          price: area.price,
          is_enabled: true
        }));
        
      if (areasToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('delivery_areas')
          .insert(areasToInsert);
          
        if (insertError) throw insertError;
      }
    }
    
    toast.success("تم حفظ إعدادات الشحن بنجاح");
    return true;
  } catch (error) {
    console.error("Error saving shipping settings:", error);
    toast.error("حدث خطأ أثناء حفظ إعدادات الشحن");
    return false;
  }
};
