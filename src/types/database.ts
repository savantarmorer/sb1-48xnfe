export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface TableRow {
  achievements: {
    id: string
    title: string
    description: string
    category: string
    points: number
    rarity: string
    unlocked: boolean
    unlocked_at: string | null
    prerequisites: string[]
    dependents: string[]
    trigger_conditions: Json
    order_num: number
    created_at: string
    updated_at: string
  }
  battle_stats: {
    id: string
    user_id: string
    total_battles: number
    wins: number
    losses: number
    win_streak: number
    highest_streak: number
    total_xp_earned: number
    total_coins_earned: number
    updated_at: string
  }
  // ... continue with other table definitions
}

type TableInsert<T extends keyof TableRow> = Omit<TableRow[T], 'created_at' | 'updated_at'>
type TableUpdate<T extends keyof TableRow> = Partial<TableInsert<T>>

export interface Database {
  public: {
    Tables: {
      achievements: {
        Row: TableRow['achievements']
        Insert: TableInsert<'achievements'>
        Update: TableUpdate<'achievements'>
      }
      battle_stats: {
        Row: TableRow['battle_stats']
        Insert: TableInsert<'battle_stats'>
        Update: TableUpdate<'battle_stats'>
      }
      // ... continue with other tables
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      quest_requirement_type: 'score' | 'time' | 'battles' | 'streak' | 'study_time' | 'items' | 'achievements'
    }
  }
} 

