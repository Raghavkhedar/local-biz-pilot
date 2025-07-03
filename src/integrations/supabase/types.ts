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
      business_profiles: {
        Row: {
          address: string | null
          company_name: string
          created_at: string
          email: string | null
          gst_number: string | null
          id: number
          logo_url: string | null
          phone: string | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: number
          logo_url?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: number
          logo_url?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string
          created_at: string
          credit_limit: number | null
          customer_group: string | null
          email: string | null
          gst_number: string | null
          id: number
          name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          credit_limit?: number | null
          customer_group?: string | null
          email?: string | null
          gst_number?: string | null
          id?: number
          name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          credit_limit?: number | null
          customer_group?: string | null
          email?: string | null
          gst_number?: string | null
          id?: number
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          hsn_code: string | null
          id: number
          invoice_id: number
          product_id: number
          product_name: string
          quantity: number
          tax_rate: number | null
          total: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hsn_code?: string | null
          id?: number
          invoice_id: number
          product_id: number
          product_name: string
          quantity: number
          tax_rate?: number | null
          total: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hsn_code?: string | null
          id?: number
          invoice_id?: number
          product_id?: number
          product_name?: string
          quantity?: number
          tax_rate?: number | null
          total?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: number
          customer_name: string
          due_date: string
          id: number
          invoice_number: string
          notes: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: number
          customer_name: string
          due_date: string
          id?: number
          invoice_number: string
          notes?: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: number
          customer_name?: string
          due_date?: string
          id?: number
          invoice_number?: string
          notes?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          area_per_piece: number | null
          area_unit: string | null
          barcode: string | null
          category: string
          color: string | null
          created_at: string
          description: string | null
          dimensions: Json | null
          finish: string | null
          grade: string | null
          hsn_code: string | null
          id: number
          images: string[] | null
          low_stock_threshold: number
          manufacturer: string | null
          material: string | null
          name: string
          origin: string | null
          pattern: string | null
          pieces_per_box: number | null
          price: number
          quantity: number
          sku: string
          slip_resistance: string | null
          tax_rate: number | null
          unit: string
          updated_at: string
          usage: string[] | null
          user_id: string
          water_resistance: string | null
        }
        Insert: {
          area_per_piece?: number | null
          area_unit?: string | null
          barcode?: string | null
          category: string
          color?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          finish?: string | null
          grade?: string | null
          hsn_code?: string | null
          id?: number
          images?: string[] | null
          low_stock_threshold?: number
          manufacturer?: string | null
          material?: string | null
          name: string
          origin?: string | null
          pattern?: string | null
          pieces_per_box?: number | null
          price: number
          quantity?: number
          sku: string
          slip_resistance?: string | null
          tax_rate?: number | null
          unit: string
          updated_at?: string
          usage?: string[] | null
          user_id: string
          water_resistance?: string | null
        }
        Update: {
          area_per_piece?: number | null
          area_unit?: string | null
          barcode?: string | null
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          dimensions?: Json | null
          finish?: string | null
          grade?: string | null
          hsn_code?: string | null
          id?: number
          images?: string[] | null
          low_stock_threshold?: number
          manufacturer?: string | null
          material?: string | null
          name?: string
          origin?: string | null
          pattern?: string | null
          pieces_per_box?: number | null
          price?: number
          quantity?: number
          sku?: string
          slip_resistance?: string | null
          tax_rate?: number | null
          unit?: string
          updated_at?: string
          usage?: string[] | null
          user_id?: string
          water_resistance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          pin: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pin: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pin?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
