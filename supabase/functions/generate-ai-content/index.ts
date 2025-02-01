import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.11.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()

    const openAI = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    }))

    let prompt = ''
    if (type === 'property_content') {
      prompt = `Create engaging content for a real estate property listing with the following details:
        Property: ${data.title}
        Price: ${data.price}
        Specs: ${data.bedrooms} beds, ${data.bathrooms} baths, ${data.squareFootage} sq ft
        Location: ${data.address}
        
        Generate content for:
        1. Hero section headline and subtitle
        2. Property description
        3. Key highlights
        4. Neighborhood description`
    } else if (type === 'similar_properties') {
      prompt = `Find similar properties to:
        Price Range: ${data.price}
        Type: ${data.title}
        Location: ${data.address}
        Size: ${data.squareFootage} sq ft`
    }

    const completion = await openAI.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })

    return new Response(
      JSON.stringify(completion.data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})