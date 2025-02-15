import { supabase } from '../lib/supabase';

interface AIBuilderProps {
  industry: string;
  target_audience: string;
  tone_of_voice: string;
  key_features: string[];
  unique_selling_points: string[];
}

// Update this URL with your actual Supabase project URL
const SUPABASE_FUNCTION_URL =
  'https://[YOUR-PROJECT-ID].supabase.co/functions/v1/ai-builder';

export const aiBuilder = {
  async callAIFunction(type: string, payload: any) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ type, payload }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'AI generation failed');
    }

    return response.json();
  },

  async generateContent(props: AIBuilderProps) {
    return this.callAIFunction('generate_content', props);
  },

  async generateStyles(
    props: Pick<AIBuilderProps, 'industry' | 'tone_of_voice'>
  ) {
    return this.callAIFunction('generate_styles', props);
  },

  async generateLayout(sections: string[]) {
    return this.callAIFunction('generate_layout', { sections });
  },
};
