
import { supabase } from "@/integrations/supabase/client";

export interface CustomerDatabaseClient {
  // Add customer-related methods as needed
}

export class SupabaseCustomerClient implements CustomerDatabaseClient {
  // Implement customer-related methods
}

export const customerClient = new SupabaseCustomerClient();
