export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      guides: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          slug: string
          published: boolean
          wifi_name: string | null
          wifi_password: string | null
          checkin_instructions: string | null
          checkout_checklist: string | null
          parking_instructions: string | null
          trash_instructions: string | null
          emergency_contact: string | null
          tv_entertainment: string | null
          laundry: string | null
          amenities: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          slug: string
          published?: boolean
          wifi_name?: string | null
          wifi_password?: string | null
          checkin_instructions?: string | null
          checkout_checklist?: string | null
          parking_instructions?: string | null
          trash_instructions?: string | null
          emergency_contact?: string | null
          tv_entertainment?: string | null
          laundry?: string | null
          amenities?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          title?: string
          slug?: string
          published?: boolean
          wifi_name?: string | null
          wifi_password?: string | null
          checkin_instructions?: string | null
          checkout_checklist?: string | null
          parking_instructions?: string | null
          trash_instructions?: string | null
          emergency_contact?: string | null
          tv_entertainment?: string | null
          laundry?: string | null
          amenities?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type Guide = Database['public']['Tables']['guides']['Row']
export type GuideInsert = Database['public']['Tables']['guides']['Insert']
export type GuideUpdate = Database['public']['Tables']['guides']['Update']
