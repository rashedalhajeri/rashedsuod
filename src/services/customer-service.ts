
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

// Type guard to ensure status is 'active' or 'inactive'
const ensureValidStatus = (status: string): "active" | "inactive" => {
  return status === "active" ? "active" : "inactive";
};

// Transform database result to match Customer interface
const mapDbCustomerToCustomer = (dbCustomer: any): Customer => {
  return {
    ...dbCustomer,
    status: ensureValidStatus(dbCustomer.status),
    total_orders: Number(dbCustomer.total_orders || 0),
    total_spent: Number(dbCustomer.total_spent || 0),
  };
};

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

    const mappedCustomers = (data || []).map(customer => mapDbCustomerToCustomer(customer));

    return {
      customers: mappedCustomers,
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

    return data ? mapDbCustomerToCustomer(data) : null;
  } catch (error) {
    console.error("Error in fetchCustomerDetails:", error);
    return null;
  }
};

// Create a new customer
export const createCustomer = async (storeId: string, customerData: Partial<Customer>) => {
  try {
    // Make sure name is provided as it's required in the database
    if (!customerData.name) {
      return { success: false, error: "Customer name is required" };
    }

    const customerToInsert = {
      ...customerData,
      store_id: storeId,
      status: ensureValidStatus(customerData.status || 'active')
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(customerToInsert)
      .select();

    if (error) {
      console.error("Error creating customer:", error);
      return { success: false, error };
    }

    return { success: true, customer: data?.[0] ? mapDbCustomerToCustomer(data[0]) : null };
  } catch (error) {
    console.error("Error in createCustomer:", error);
    return { success: false, error };
  }
};

// Update a customer
export const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
  try {
    // Ensure status is valid if provided
    const updatesWithValidStatus = {
      ...updates,
      ...(updates.status && { status: ensureValidStatus(updates.status) })
    };

    const { data, error } = await supabase
      .from('customers')
      .update(updatesWithValidStatus)
      .eq('id', customerId)
      .select();

    if (error) {
      console.error("Error updating customer:", error);
      return { success: false, error };
    }

    return { 
      success: true, 
      customer: data?.[0] ? mapDbCustomerToCustomer(data[0]) : null 
    };
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
