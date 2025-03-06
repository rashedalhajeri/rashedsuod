
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  sort_order: number;
  store_id?: string;
}

export const fetchUserStoreId = async () => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;
    
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', userData.user.id)
      .maybeSingle();
      
    if (storeError) throw storeError;
    return storeData?.id || null;
  } catch (err) {
    console.error("Error fetching user store:", err);
    return null;
  }
};

export const fetchCategories = async (storeId: string) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err) {
    console.error("Error fetching categories:", err);
    return { data: [], error: err };
  }
};

export const addCategory = async (name: string, storeId: string, sortOrder: number) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        store_id: storeId,
        sort_order: sortOrder
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error("Error adding category:", err);
    return { data: null, error: err };
  }
};

export const updateCategory = async (category: Category, storeId: string) => {
  try {
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name
      })
      .eq('id', category.id)
      .eq('store_id', storeId);
      
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error("Error updating category:", err);
    return { error: err };
  }
};

export const deleteCategory = async (categoryId: string, storeId: string) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('store_id', storeId);
      
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { error: err };
  }
};
