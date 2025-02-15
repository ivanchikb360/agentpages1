import { serve } from 'https://deno.fresh.run/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

serve(async (req) => {
  try {
    const propertyInfo = await req.json();
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Generate engaging web copy for a real estate listing with the following information:
            Title: ${propertyInfo.title}
            Price: ${propertyInfo.price}
            Bedrooms: ${propertyInfo.bedrooms}
            Bathrooms: ${propertyInfo.bathrooms}
            Square Footage: ${propertyInfo.squareFootage}
            Address: ${propertyInfo.address}
            Description: ${propertyInfo.description}
            Features: ${propertyInfo.features.join(', ')}
          `
        }
      ]
    });

    const sections = [
      {
        type: 'hero',
        content: {
          title: propertyInfo.title,
          subtitle: `${propertyInfo.bedrooms} Beds • ${propertyInfo.bathrooms} Baths • ${propertyInfo.squareFootage} sqft`,
          image: propertyInfo.images[0],
          cta: 'Schedule a Viewing'
        }
      },
      // Add more sections based on AI response
    ];

    return new Response(JSON.stringify(sections), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}); 