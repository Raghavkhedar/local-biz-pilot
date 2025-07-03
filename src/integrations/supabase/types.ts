export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          pin: string
          role: 'owner' | 'staff'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          pin: string
          role?: 'owner' | 'staff'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          pin?: string
          role?: 'owner' | 'staff'
        }
      }
      business_profiles: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: string
          company_name: string
          address: string | null
          phone: string | null
          email: string | null
          gst_number: string | null
          logo_url: string | null
          settings: Json | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id: string
          company_name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          gst_number?: string | null
          logo_url?: string | null
          settings?: Json | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id?: string
          company_name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          gst_number?: string | null
          logo_url?: string | null
          settings?: Json | null
        }
      }
      products: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: string
          name: string
          sku: string
          price: number
          quantity: number
          category: string
          barcode: string | null
          low_stock_threshold: number
          images: string[] | null
          unit: 'box' | 'piece' | 'square_feet' | 'square_meter'
          pieces_per_box: number | null
          area_per_piece: number | null
          area_unit: 'square_feet' | 'square_meter' | null
          dimensions: Json | null
          material: string | null
          finish: string | null
          color: string | null
          pattern: string | null
          grade: 'premium' | 'standard' | 'economy' | null
          water_resistance: 'high' | 'medium' | 'low' | null
          slip_resistance: 'R9' | 'R10' | 'R11' | 'R12' | 'R13' | null
          usage: string[] | null
          manufacturer: string | null
          origin: string | null
          hsn_code: string | null
          tax_rate: number | null
          description: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          sku: string
          price: number
          quantity: number
          category: string
          barcode?: string | null
          low_stock_threshold: number
          images?: string[] | null
          unit: 'box' | 'piece' | 'square_feet' | 'square_meter'
          pieces_per_box?: number | null
          area_per_piece?: number | null
          area_unit?: 'square_feet' | 'square_meter' | null
          dimensions?: Json | null
          material?: string | null
          finish?: string | null
          color?: string | null
          pattern?: string | null
          grade?: 'premium' | 'standard' | 'economy' | null
          water_resistance?: 'high' | 'medium' | 'low' | null
          slip_resistance?: 'R9' | 'R10' | 'R11' | 'R12' | 'R13' | null
          usage?: string[] | null
          manufacturer?: string | null
          origin?: string | null
          hsn_code?: string | null
          tax_rate?: number | null
          description?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          sku?: string
          price?: number
          quantity?: number
          category?: string
          barcode?: string | null
          low_stock_threshold?: number
          images?: string[] | null
          unit?: 'box' | 'piece' | 'square_feet' | 'square_meter'
          pieces_per_box?: number | null
          area_per_piece?: number | null
          area_unit?: 'square_feet' | 'square_meter' | null
          dimensions?: Json | null
          material?: string | null
          finish?: string | null
          color?: string | null
          pattern?: string | null
          grade?: 'premium' | 'standard' | 'economy' | null
          water_resistance?: 'high' | 'medium' | 'low' | null
          slip_resistance?: 'R9' | 'R10' | 'R11' | 'R12' | 'R13' | null
          usage?: string[] | null
          manufacturer?: string | null
          origin?: string | null
          hsn_code?: string | null
          tax_rate?: number | null
          description?: string | null
        }
      }
      customers: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: string
          name: string
          phone: string
          email: string | null
          address: string
          gst_number: string | null
          credit_limit: number | null
          customer_group: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          address: string
          gst_number?: string | null
          credit_limit?: number | null
          customer_group?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          address?: string
          gst_number?: string | null
          credit_limit?: number | null
          customer_group?: string | null
        }
      }
      invoices: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          user_id: string
          invoice_number: string
          customer_id: number
          customer_name: string
          subtotal: number
          tax: number
          total: number
          status: 'draft' | 'sent' | 'paid' | 'cancelled'
          due_date: string
          notes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id: string
          invoice_number: string
          customer_id: number
          customer_name: string
          subtotal: number
          tax: number
          total: number
          status: 'draft' | 'sent' | 'paid' | 'cancelled'
          due_date: string
          notes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          user_id?: string
          invoice_number?: string
          customer_id?: number
          customer_name?: string
          subtotal?: number
          tax?: number
          total?: number
          status?: 'draft' | 'sent' | 'paid' | 'cancelled'
          due_date?: string
          notes?: string | null
        }
      }
      invoice_items: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          invoice_id: number
          product_id: number
          product_name: string
          quantity: number
          unit_price: number
          total: number
          tax_rate: number | null
          hsn_code: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          invoice_id: number
          product_id: number
          product_name: string
          quantity: number
          unit_price: number
          total: number
          tax_rate?: number | null
          hsn_code?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          invoice_id?: number
          product_id?: number
          product_name?: string
          quantity?: number
          unit_price?: number
          total?: number
          tax_rate?: number | null
          hsn_code?: string | null
        }
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
  }
}
