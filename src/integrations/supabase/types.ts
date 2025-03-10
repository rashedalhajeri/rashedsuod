export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          reason: string | null
          record_id: string
          store_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          reason?: string | null
          record_id: string
          store_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          reason?: string | null
          record_id?: string
          store_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_settings: {
        Row: {
          created_at: string
          id: string
          store_id: string
          transition_time: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          store_id: string
          transition_time?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          store_id?: string
          transition_time?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banner_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          link_type: string
          link_url: string | null
          sort_order: number
          store_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_type: string
          link_url?: string | null
          sort_order?: number
          store_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_type?: string
          link_url?: string | null
          sort_order?: number
          store_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banners_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          name: string
          sort_order: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          city: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          email: string | null
          id: string
          last_order_date: string | null
          name: string
          phone: string | null
          status: string
          store_id: string
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          name: string
          phone?: string | null
          status?: string
          store_id: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          email?: string | null
          id?: string
          last_order_date?: string | null
          name?: string
          phone?: string | null
          status?: string
          store_id?: string
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_areas: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          name: string
          price: number
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          name: string
          price?: number
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          name?: string
          price?: number
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_areas_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          id: string
          notes: string | null
          order_number: string
          payment_method: string
          shipping_address: string
          status: string
          store_id: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          id?: string
          notes?: string | null
          order_number: string
          payment_method: string
          shipping_address: string
          status?: string
          store_id: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          payment_method?: string
          shipping_address?: string
          status?: string
          store_id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          order_id: string | null
          payment_method: string
          status: string
          store_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          payment_method: string
          status: string
          store_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string
          status?: string
          store_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_stats: {
        Row: {
          active_stores: number | null
          id: string
          suspended_stores: number | null
          total_orders: number | null
          total_revenue: number | null
          total_stores: number | null
          updated_at: string | null
        }
        Insert: {
          active_stores?: number | null
          id?: string
          suspended_stores?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          total_stores?: number | null
          updated_at?: string | null
        }
        Update: {
          active_stores?: number | null
          id?: string
          suspended_stores?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          total_stores?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          additional_images: Json | null
          available_colors: Json | null
          available_sizes: Json | null
          category_id: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          deletion_reason: string | null
          description: string | null
          discount_price: number | null
          has_colors: boolean | null
          has_sizes: boolean | null
          id: string
          image_url: string | null
          is_active: boolean
          is_archived: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          require_customer_image: boolean | null
          require_customer_name: boolean | null
          sales_count: number | null
          section_id: string | null
          stock_quantity: number | null
          store_id: string
          track_inventory: boolean | null
          updated_at: string
        }
        Insert: {
          additional_images?: Json | null
          available_colors?: Json | null
          available_sizes?: Json | null
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description?: string | null
          discount_price?: number | null
          has_colors?: boolean | null
          has_sizes?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_archived?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          require_customer_image?: boolean | null
          require_customer_name?: boolean | null
          sales_count?: number | null
          section_id?: string | null
          stock_quantity?: number | null
          store_id: string
          track_inventory?: boolean | null
          updated_at?: string
        }
        Update: {
          additional_images?: Json | null
          available_colors?: Json | null
          available_sizes?: Json | null
          category_id?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          deletion_reason?: string | null
          description?: string | null
          discount_price?: number | null
          has_colors?: boolean | null
          has_sizes?: boolean | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_archived?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          require_customer_image?: boolean | null
          require_customer_name?: boolean | null
          sales_count?: number | null
          section_id?: string | null
          stock_quantity?: number | null
          store_id?: string
          track_inventory?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          section_type: string
          sort_order: number
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          section_type?: string
          sort_order?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          section_type?: string
          sort_order?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          bronze_delivery_speed: string | null
          created_at: string | null
          delivery_time_unit: string | null
          free_shipping: boolean
          free_shipping_min_order: number | null
          id: string
          shipping_method: string
          standard_delivery_time: string | null
          store_id: string
          updated_at: string | null
        }
        Insert: {
          bronze_delivery_speed?: string | null
          created_at?: string | null
          delivery_time_unit?: string | null
          free_shipping?: boolean
          free_shipping_min_order?: number | null
          id?: string
          shipping_method?: string
          standard_delivery_time?: string | null
          store_id: string
          updated_at?: string | null
        }
        Update: {
          bronze_delivery_speed?: string | null
          created_at?: string | null
          delivery_time_unit?: string | null
          free_shipping?: boolean
          free_shipping_min_order?: number | null
          id?: string
          shipping_method?: string
          standard_delivery_time?: string | null
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          orders_count: number | null
          store_id: string
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          orders_count?: number | null
          store_id: string
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          orders_count?: number | null
          store_id?: string
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_stats_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_theme_settings: {
        Row: {
          accent_color: string
          created_at: string
          custom_css: string | null
          font_family: string
          id: string
          layout_type: string
          primary_color: string
          products_per_row: number
          secondary_color: string
          show_category_images: boolean | null
          store_id: string
          theme_id: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          custom_css?: string | null
          font_family?: string
          id?: string
          layout_type?: string
          primary_color?: string
          products_per_row?: number
          secondary_color?: string
          show_category_images?: boolean | null
          store_id: string
          theme_id: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          custom_css?: string | null
          font_family?: string
          id?: string
          layout_type?: string
          primary_color?: string
          products_per_row?: number
          secondary_color?: string
          show_category_images?: boolean | null
          store_id?: string
          theme_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_theme_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          country: string
          created_at: string
          currency: string
          description: string | null
          domain_name: string
          id: string
          logo_url: string | null
          phone_number: string
          status: string | null
          store_name: string
          subscription_end_date: string | null
          subscription_plan: string
          subscription_start_date: string | null
          suspension_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          domain_name: string
          id?: string
          logo_url?: string | null
          phone_number: string
          status?: string | null
          store_name: string
          subscription_end_date?: string | null
          subscription_plan?: string
          subscription_start_date?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          currency?: string
          description?: string | null
          domain_name?: string
          id?: string
          logo_url?: string | null
          phone_number?: string
          status?: string | null
          store_name?: string
          subscription_end_date?: string | null
          subscription_plan?: string
          subscription_start_date?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json
          id: string
          max_orders: number
          max_products: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          id?: string
          max_orders?: number
          max_products?: number
          name: string
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          id?: string
          max_orders?: number
          max_products?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_deleted_items: {
        Row: {
          deleted_at: string | null
          deleted_by_email: string | null
          deletion_reason: string | null
          id: string | null
          item_name: string | null
          store_id: string | null
          store_name: string | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      count_payment_methods_by_store: {
        Args: {
          store_id_param: string
        }
        Returns: {
          payment_method: string
          count: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          admin_id: string
          action_type: string
          target_type: string
          target_id: string
          details: Json
        }
        Returns: string
      }
      upgrade_store_plan: {
        Args: {
          store_id: string
          new_plan: string
          payment_status?: string
        }
        Returns: undefined
      }
      user_owns_store: {
        Args: {
          store_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
