
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: "active" | "inactive";
  total_orders: number;
  total_spent: number;
  last_order_date: string;
  created_at: string;
  updated_at: string;
}

// Fetch customers for a store
export const fetchCustomers = async (storeId: string, filters = {}) => {
  try {
    const { data, error, count } = await supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      return { customers: [], totalCount: 0 };
    }

    return {
      customers: data || [],
      totalCount: count || 0
    };
  } catch (error) {
    console.error("Error in fetchCustomers:", error);
    return { customers: [], totalCount: 0 };
  }
};

// Fetch customer details
export const fetchCustomerDetails = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching customer details:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchCustomerDetails:", error);
    return null;
  }
};

// Create a new customer
export const createCustomer = async (storeId: string, customerData: Partial<Customer>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ ...customerData, store_id: storeId }])
      .select();

    if (error) {
      console.error("Error creating customer:", error);
      return { success: false, error };
    }

    return { success: true, customer: data[0] };
  } catch (error) {
    console.error("Error in createCustomer:", error);
    return { success: false, error };
  }
};

// Update a customer
export const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId)
      .select();

    if (error) {
      console.error("Error updating customer:", error);
      return { success: false, error };
    }

    return { success: true, customer: data[0] };
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    return { success: false, error };
  }
};

// Delete a customer
export const deleteCustomer = async (customerId: string) => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) {
      console.error("Error deleting customer:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    return { success: false, error };
  }
};
