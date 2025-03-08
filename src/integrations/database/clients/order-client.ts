
import { supabase } from "@/integrations/supabase/client";

export interface OrderDatabaseClient {
  // Add order-related methods as needed
}

export class SupabaseOrderClient implements OrderDatabaseClient {
  // Implement order-related methods
}

export const orderClient = new SupabaseOrderClient();
