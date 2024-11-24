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
      quests: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          xp_reward: number;
          coin_reward: number;
          deadline: string;
          progress: number;
          requirements: Json[];
          lootbox?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['quests']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['quests']['Row']>;
      };
      items: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: string;
          rarity: string;
          cost: number;
          effects: Json[];
          requirements: Json[];
          metadata: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['items']['Row']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          roles: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
    }
  }
}

export const convertToJson = <T>(data: T): Json => {
  return JSON.parse(JSON.stringify(data));
};

export const convertFromJson = <T>(json: Json): T => {
  return json as T;
};


