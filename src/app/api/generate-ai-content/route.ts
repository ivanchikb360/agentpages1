import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: Request, res: Response) {
  try {
    const body = req.body;

    const { data, error } = await supabase.functions.invoke(
      'generate-ai-content',
      {
        body: body,
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`
        }
      }
    );

    if (error) {
      console.error('Edge Function Error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
} 