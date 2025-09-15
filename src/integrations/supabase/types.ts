export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      billing: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string
          paid_date: string | null
          payment_method: string | null
          service_type: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          paid_date?: string | null
          payment_method?: string | null
          service_type: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          paid_date?: string | null
          payment_method?: string | null
          service_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      controllers: {
        Row: {
          configuration: Json | null
          controller_id: string
          created_at: string | null
          device_name: string
          device_type: string
          firmware_version: string | null
          id: string
          installation_date: string | null
          installation_id: string | null
          ip_address: unknown | null
          is_active: boolean | null
          is_online: boolean | null
          last_heartbeat: string | null
          location: Json | null
          mac_address: string | null
          updated_at: string | null
          user_id: string
          warranty_expiry: string | null
        }
        Insert: {
          configuration?: Json | null
          controller_id: string
          created_at?: string | null
          device_name: string
          device_type: string
          firmware_version?: string | null
          id?: string
          installation_date?: string | null
          installation_id?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          is_online?: boolean | null
          last_heartbeat?: string | null
          location?: Json | null
          mac_address?: string | null
          updated_at?: string | null
          user_id: string
          warranty_expiry?: string | null
        }
        Update: {
          configuration?: Json | null
          controller_id?: string
          created_at?: string | null
          device_name?: string
          device_type?: string
          firmware_version?: string | null
          id?: string
          installation_date?: string | null
          installation_id?: string | null
          ip_address?: unknown | null
          is_active?: boolean | null
          is_online?: boolean | null
          last_heartbeat?: string | null
          location?: Json | null
          mac_address?: string | null
          updated_at?: string | null
          user_id?: string
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      energy_metrics: {
        Row: {
          alerts: Json | null
          battery_current_a: number | null
          battery_level_percent: number | null
          battery_power_w: number | null
          battery_temp_c: number | null
          battery_voltage_v: number | null
          controller_id: string
          efficiency_percent: number | null
          energy_generated_kwh_daily: number | null
          energy_used_kwh_daily: number | null
          grid_power_w: number | null
          house_load_w: number | null
          id: string
          inverter_temp_c: number | null
          solar_generation_w: number | null
          system_status: string | null
          timestamp: string | null
        }
        Insert: {
          alerts?: Json | null
          battery_current_a?: number | null
          battery_level_percent?: number | null
          battery_power_w?: number | null
          battery_temp_c?: number | null
          battery_voltage_v?: number | null
          controller_id: string
          efficiency_percent?: number | null
          energy_generated_kwh_daily?: number | null
          energy_used_kwh_daily?: number | null
          grid_power_w?: number | null
          house_load_w?: number | null
          id?: string
          inverter_temp_c?: number | null
          solar_generation_w?: number | null
          system_status?: string | null
          timestamp?: string | null
        }
        Update: {
          alerts?: Json | null
          battery_current_a?: number | null
          battery_level_percent?: number | null
          battery_power_w?: number | null
          battery_temp_c?: number | null
          battery_voltage_v?: number | null
          controller_id?: string
          efficiency_percent?: number | null
          energy_generated_kwh_daily?: number | null
          energy_used_kwh_daily?: number | null
          grid_power_w?: number | null
          house_load_w?: number | null
          id?: string
          inverter_temp_c?: number | null
          solar_generation_w?: number | null
          system_status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_metrics_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "controllers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          brand: string | null
          component_name: string
          component_type: string
          condition: string | null
          controller_id: string
          created_at: string | null
          id: string
          installation_date: string | null
          last_maintenance: string | null
          maintenance_schedule: string | null
          model: string | null
          next_maintenance: string | null
          notes: string | null
          quantity: number | null
          serial_number: string | null
          unit_cost: number | null
          updated_at: string | null
          warranty_end: string | null
          warranty_start: string | null
        }
        Insert: {
          brand?: string | null
          component_name: string
          component_type: string
          condition?: string | null
          controller_id: string
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance?: string | null
          maintenance_schedule?: string | null
          model?: string | null
          next_maintenance?: string | null
          notes?: string | null
          quantity?: number | null
          serial_number?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Update: {
          brand?: string | null
          component_name?: string
          component_type?: string
          condition?: string | null
          controller_id?: string
          created_at?: string | null
          id?: string
          installation_date?: string | null
          last_maintenance?: string | null
          maintenance_schedule?: string | null
          model?: string | null
          next_maintenance?: string | null
          notes?: string | null
          quantity?: number | null
          serial_number?: string | null
          unit_cost?: number | null
          updated_at?: string | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "controllers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          min_stock_level: number | null
          model: string | null
          name: string
          partner_id: string | null
          price: number | null
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          min_stock_level?: number | null
          model?: string | null
          name: string
          partner_id?: string | null
          price?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          min_stock_level?: number | null
          model?: string | null
          name?: string
          partner_id?: string | null
          price?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          partner_category: string | null
          phone: string | null
          service_class: string | null
          updated_at: string | null
          user_id: string
          verification_id: string | null
          verification_type: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          partner_category?: string | null
          phone?: string | null
          service_class?: string | null
          updated_at?: string | null
          user_id: string
          verification_id?: string | null
          verification_type?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          partner_category?: string | null
          phone?: string | null
          service_class?: string | null
          updated_at?: string | null
          user_id?: string
          verification_id?: string | null
          verification_type?: string | null
        }
        Relationships: []
      }
      ticket_updates: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          new_value: string | null
          old_value: string | null
          ticket_id: string
          update_type: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          ticket_id: string
          update_type?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          ticket_id?: string
          update_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_updates_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          closed_at: string | null
          controller_id: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          status: string | null
          ticket_number: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          controller_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          ticket_number: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          closed_at?: string | null
          controller_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          ticket_number?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_controller_id_fkey"
            columns: ["controller_id"]
            isOneToOne: false
            referencedRelation: "controllers"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
