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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
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
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          stock_quantity: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          stock_quantity?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          stock_quantity?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
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
          domain_name: string
          id: string
          logo_url: string | null
          phone_number: string
          store_name: string
          subscription_end_date: string | null
          subscription_plan: string
          subscription_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          country?: string
          created_at?: string
          currency?: string
          domain_name: string
          id?: string
          logo_url?: string | null
          phone_number: string
          store_name: string
          subscription_end_date?: string | null
          subscription_plan?: string
          subscription_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string
          currency?: string
          domain_name?: string
          id?: string
          logo_url?: string | null
          phone_number?: string
          store_name?: string
          subscription_end_date?: string | null
          subscription_plan?: string
          subscription_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
