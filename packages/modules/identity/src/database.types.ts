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
      profiles: {
        Row: {
          id: string
          name: string
          role: string
          avatar_url: string | null
          organization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: string
          avatar_url?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          avatar_url?: string | null
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      user_role: 'director' | 'project_manager' | 'scheduler' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}