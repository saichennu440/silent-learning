import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  //console.error('Missing Supabase environment variables!');
  //console.error('Please check your .env file contains:');
  //console.error('VITE_SUPABASE_URL=your-project-url');
  //console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // We're not using auth sessions for now
  }
});

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    //console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    //console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
};