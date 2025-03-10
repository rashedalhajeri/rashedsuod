
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Section {
  id: string;
  name: string;
  section_type: string;
  store_id: string;
  sort_order: number;
  is_active: boolean;
  category_id?: string | null;
  product_ids?: string[] | null;
  display_style?: 'grid' | 'list';
  created_at?: string;
  updated_at?: string;
}

// Fetch all sections for a store
export const fetchSections = async (storeId: string) => {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (err) {
    console.error("Error fetching sections:", err);
    return { data: null, error: err };
  }
};

// Add a new section
export const addSection = async (
  name: string,
  sectionType: string,
  storeId: string,
  sortOrder: number,
  isActive: boolean,
  categoryId?: string | null,
  productIds?: string[] | null,
  displayStyle: 'grid' | 'list' = 'grid'
) => {
  try {
    const { data, error } = await supabase
      .from('sections')
      .insert([
        {
          name,
          section_type: sectionType,
          store_id: storeId,
          sort_order: sortOrder,
          is_active: isActive,
          category_id: categoryId || null,
          product_ids: productIds || null,
          display_style: displayStyle
        }
      ])
      .select();
      
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Error adding section:", err);
    return { data: null, error: err };
  }
};

// Update an existing section
export const updateSection = async (section: Section, storeId: string) => {
  try {
    // Verify store ownership
    const { error: verifyError } = await supabase
      .rpc('user_owns_store', { store_id: storeId });
      
    if (verifyError) {
      throw new Error("غير مسموح لك بتعديل هذا القسم");
    }
    
    const { data, error } = await supabase
      .from('sections')
      .update({
        name: section.name,
        section_type: section.section_type,
        is_active: section.is_active,
        category_id: section.category_id || null,
        product_ids: section.product_ids || null,
        display_style: section.display_style || 'grid',
        updated_at: new Date().toISOString()
      })
      .eq('id', section.id)
      .eq('store_id', storeId)
      .select();
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (err) {
    console.error("Error updating section:", err);
    return { data: null, error: err };
  }
};

// Delete a section
export const deleteSection = async (sectionId: string, storeId: string) => {
  try {
    // Verify store ownership
    const { error: verifyError } = await supabase
      .rpc('user_owns_store', { store_id: storeId });
      
    if (verifyError) {
      throw new Error("غير مسموح لك بحذف هذا القسم");
    }
    
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId)
      .eq('store_id', storeId);
      
    if (error) throw error;
    
    return { error: null };
  } catch (err) {
    console.error("Error deleting section:", err);
    return { error: err };
  }
};

// Update section order
export const updateSectionOrder = async (sections: Section[], storeId: string) => {
  try {
    const updates = sections.map(section => ({
      id: section.id,
      sort_order: section.sort_order
    }));
    
    const { error } = await supabase.rpc('batch_update_section_order', { 
      updates: updates,
      store_id: storeId
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (err) {
    console.error("Error updating section order:", err);
    return { error: err };
  }
};

// Get all active sections for a store (for front-end display)
export const getActiveSections = async (storeId: string) => {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (err) {
    console.error("Error fetching active sections:", err);
    return { data: null, error: err };
  }
};

// Get products for a specific section type
export const getSectionProducts = async (
  storeId: string, 
  sectionType: string, 
  categoryId?: string | null,
  productIds?: string[] | null,
  limit: number = 25
) => {
  try {
    let query;
    
    switch (sectionType) {
      case 'best_selling':
        // Get best selling products
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .order('sales_count', { ascending: false })
          .limit(limit);
        break;
        
      case 'new_arrivals':
        // Get newest products
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit);
        break;
        
      case 'featured':
        // Get featured products
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('sales_count', { ascending: false })
          .limit(limit);
        break;
        
      case 'on_sale':
        // Get products with discount
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .not('discount_price', 'is', null)
          .order('created_at', { ascending: false })
          .limit(limit);
        break;
        
      case 'category':
        // Get products from a specific category
        if (!categoryId) {
          return { data: [], error: new Error('Category ID is required') };
        }
        
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })
          .limit(limit);
        break;
        
      case 'custom':
        // Get specific products
        if (!productIds || productIds.length === 0) {
          return { data: [], error: new Error('Product IDs are required') };
        }
        
        query = supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .in('id', productIds)
          .limit(limit);
        break;
        
      default:
        return { data: [], error: null };
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (err) {
    console.error("Error fetching section products:", err);
    return { data: null, error: err };
  }
};
