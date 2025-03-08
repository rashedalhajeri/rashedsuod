
import { supabase } from "@/integrations/supabase/client";
import { mapRawProductToProduct } from "@/utils/products/mappers";
import { RawProductData } from "@/utils/products/types";

export async function updateProduct(productId: string, updates: any) {
  try {
    const validUpdates = { ...updates };
    
    if (validUpdates.additional_images && Array.isArray(validUpdates.additional_images)) {
      validUpdates.additional_images = JSON.stringify(validUpdates.additional_images);
    }
    
    if (validUpdates.available_colors && Array.isArray(validUpdates.available_colors)) {
      validUpdates.available_colors = JSON.stringify(validUpdates.available_colors);
    }
    
    if (validUpdates.available_sizes && Array.isArray(validUpdates.available_sizes)) {
      validUpdates.available_sizes = JSON.stringify(validUpdates.available_sizes);
    }
    
    delete validUpdates.category;
    
    console.log("Updating product with data:", validUpdates);
    
    const { data, error } = await supabase
      .from('products')
      .update(validUpdates)
      .eq('id', productId)
      .select();
      
    if (error) throw error;
    
    const processedData: any[] = [];
    
    if (data && data.length > 0) {
      const rawData = data as unknown as RawProductData[];
      
      for (let i = 0; i < rawData.length; i++) {
        const processed = mapRawProductToProduct(rawData[i]);
        processedData.push(processed);
      }
    }
    
    return { data: processedData, error: null };
  } catch (error) {
    console.error("Error updating product:", error);
    return { data: null, error };
  }
}

export async function activateProduct(productId: string, isActive: boolean) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: isActive })
      .eq('id', productId)
      .select()
      .single();
      
    if (error) throw error;
    
    if (!data) return { data: null, error: null };
    
    const product = mapRawProductToProduct(data as unknown as RawProductData);
    
    return { data: product, error: null };
  } catch (error) {
    console.error("Error updating product active status:", error);
    return { data: null, error };
  }
}

export async function bulkActivateProducts(productIds: string[], isActive: boolean) {
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: isActive })
      .in('id', productIds);
      
    return { success: !error, error };
  } catch (error) {
    console.error("Error bulk updating products active status:", error);
    return { success: false, error };
  }
}

export async function bulkUpdateCategory(productIds: string[], categoryId: string | null) {
  try {
    if (productIds.length === 0) {
      return { success: true, error: null };
    }

    console.log(`Updating category to ${categoryId} for ${productIds.length} products`);
    
    const { error } = await supabase
      .from('products')
      .update({ category_id: categoryId })
      .in('id', productIds);
      
    if (error) {
      console.error("Error updating products category:", error);
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Exception in bulkUpdateCategory:", error);
    return { success: false, error };
  }
}
