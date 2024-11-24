import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
});

/**
 * Generic data fetching utility
 * @param table - The table to fetch data from
 * @param query - Optional query parameters
 * @returns The fetched data or null if error
 */
export async function getData<T>(table: keyof typeof TABLES, query?: any): Promise<T | null> {
  try {
    let queryBuilder = supabase.from(TABLES[table]).select('*');
    
    if (query) {
      queryBuilder = queryBuilder.match(query);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error(`Error fetching data from ${table}:`, error);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in getData for ${table}:`, error);
    return null;
  }
}