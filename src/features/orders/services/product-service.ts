
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../types/order-types";

export async function fetchProductsBySearch(storeId: string, searchQuery: string): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("id, name, price")
      .eq("store_id", storeId)
      .eq("is_active", true);

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    const { data, error } = await query.limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
