import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxlxlbfaoeawhmviwtka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4bHhsYmZhb2Vhd2htdml3dGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMTEzOTksImV4cCI6MjA1Mzg4NzM5OX0.klN8L_USUpXCqnNFekzG9z7YGvD1MBLJ-BhLmhAM0ys';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection immediately
(async () => {
  try {
    const { data, error } = await supabase.from('admin_users').select('count');
    if (error) {
      console.error('Connection test failed:', error);
    } else {
      console.log('Connection test successful:', data);
    }
  } catch (err) {
    console.error('Connection test error:', err);
  }
})();
