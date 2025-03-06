
import { supabase } from "@/integrations/supabase/client";
import { StoreFormData } from "../types";
import { toast } from "sonner";

/**
 * Creates a store with the provided form data
 */
export const createStore = async (formData: StoreFormData): Promise<boolean> => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      toast.error("الرجاء تسجيل الدخول للمتابعة");
      return false;
    }

    // Create store
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .insert([
        {
          user_id: userData.user.id,
          store_name: formData.storeName,
          domain_name: formData.domainName,
          phone_number: formData.phoneNumber,
          country: formData.country,
          currency: formData.currency,
          description: formData.description
        }
      ])
      .select()
      .single();

    if (storeError) throw storeError;

    // Create store settings
    const { error: settingsError } = await supabase
      .from('store_settings')
      .insert([
        {
          store_id: storeData.id,
          shipping_method: formData.shippingMethod,
          free_shipping: formData.freeShipping,
          free_shipping_min_order: formData.freeShippingMinOrder
        }
      ]);

    if (settingsError) throw settingsError;

    // Create store theme settings
    const { error: themeError } = await supabase
      .from('store_theme_settings')
      .insert([
        {
          store_id: storeData.id,
          theme_id: formData.storeTheme
        }
      ]);

    if (themeError) throw themeError;

    return true;
  } catch (error) {
    console.error("Error creating store:", error);
    return false;
  }
};
