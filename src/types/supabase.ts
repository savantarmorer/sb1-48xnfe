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
      user_progress: {
        Row: {
          id: string
          user_id: string
          xp: number
          level: number
          coins: number
          streak: number
          achievements: Json[]
          inventory: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          xp?: number
          level?: number
          coins?: number
          streak?: number
          achievements?: Json[]
          inventory?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          xp?: number
          level?: number
          coins?: number
          streak?: number
          achievements?: Json[]
          inventory?: Json[]
          created_at?: string
          updated_at?: string
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