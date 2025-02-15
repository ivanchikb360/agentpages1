import { supabase } from '../lib/supabase';

export type WaitlistError = {
  message: string;
  code?: string;
};

export async function submitToWaitlist(email: string) {
  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      throw {
        message: 'This email is already on the waitlist',
        code: 'EMAIL_EXISTS'
      };
    }

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{ email, submitted_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) {
      throw {
        message: 'Failed to submit to waitlist',
        code: error.code
      };
    }

    return data;
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    throw error;
  }
} 