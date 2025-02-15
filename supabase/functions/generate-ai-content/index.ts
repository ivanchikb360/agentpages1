import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.28.0';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Create a fallback structure function
function createFallbackStructure(property: any) {
  return {
    layout: {
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          style: {
            typography: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '4rem',
              fontWeight: '700',
              lineHeight: '1.2'
            },
            spacing: {
              padding: '6rem 2rem',
              margin: '0',
              gap: '2rem'
            },
            colors: {
              background: '#1a1a1a',
              text: '#ffffff',
              accent: '#3b82f6'
            }
          },
          content: {
            elements: [
              {
                id: uuidv4(),
                type: 'heading',
                content: {
                  text: property?.title || 'Luxurious Property'
                },
                style: {
                  typography: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '4rem',
                    fontWeight: '700',
                    lineHeight: '1.2'
                  },
                  spacing: {
                    margin: '0 0 1rem 0'
                  },
                  colors: {
                    text: '#ffffff'
                  }
                }
              },
              {
                id: uuidv4(),
                type: 'text',
                content: {
                  text: property?.price || 'Contact for Price'
                },
                style: {
                  typography: {
                    fontSize: '2rem',
                    fontWeight: '600'
                  },
                  colors: {
                    text: '#3b82f6'
                  }
                }
              }
            ],
            background: {
              type: 'image',
              value: property?.images?.[0] || '/placeholder.jpg'
            },
            layout: 'full'
          }
        },
        {
          id: uuidv4(),
          type: 'features',
          style: {
            typography: {
              fontFamily: 'Inter, sans-serif'
            },
            spacing: {
              padding: '4rem 2rem',
              gap: '2rem'
            },
            colors: {
              background: '#ffffff',
              text: '#1a1a1a'
            }
          },
          content: {
            elements: [
              {
                id: uuidv4(),
                type: 'feature',
                content: {
                  title: 'Bedrooms',
                  description: property?.bedrooms || '4',
                  icon: '🛏️'
                }
              },
              {
                id: uuidv4(),
                type: 'feature',
                content: {
                  title: 'Bathrooms',
                  description: property?.bathrooms || '3',
                  icon: '🚿'
                }
              },
              {
                id: uuidv4(),
                type: 'feature',
                content: {
                  title: 'Square Footage',
                  description: property?.squareFootage || '2,500',
                  icon: '📏'
                }
              }
            ],
            layout: 'grid'
          }
        }
      ],
      globalStyles: {
        theme: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#f59e0b'
        },
        typography: {
          heading: 'Inter, sans-serif',
          body: 'Inter, sans-serif'
        }
      }
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let propertyData;
  try {
    const { property, requirements } = await req.json();
    propertyData = property;
    
    // Generate complete page structure with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert real estate copywriter and web designer. Create content for these specific section types:

          Content Sections:
          1. hero - Hero section with property title and key details
          2. features - Property features and specifications
          3. gallery - Image gallery showcase
          4. description - Detailed property description
          5. contact - Contact form for inquiries
          6. amenities - Property amenities list
          7. location - Location map and details
          8. neighborhood - Neighborhood information
          9. floorplan - Floor plan display
          10. testimonials - Client testimonials
          11. similar - Similar properties

          Creative Elements:
          1. showcase - Visual property showcase
          2. stats - Property statistics
          3. timeline - Property history timeline
          4. panorama - Panoramic property views
          5. highlights - Key property highlights
          6. video - Video tour section
          7. comparison - Price comparison
          8. calculator - Mortgage calculator

          For each section, provide:
          - Engaging headlines
          - Detailed descriptions
          - Relevant content elements
          - Call-to-action elements where appropriate`
        },
        {
          role: 'user',
          content: `Create comprehensive content for this property:
          Title: ${property.title}
          Price: ${property.price}
          Location: ${property.address}
          Bedrooms: ${property.bedrooms}
          Bathrooms: ${property.bathrooms}
          Square Footage: ${property.squareFootage}
          Features: ${property.features.join(', ')}
          
          Generate all sections with:
          1. Compelling headlines
          2. Detailed descriptions
          3. Feature highlights
          4. Location benefits
          5. Market insights
          6. Neighborhood details
          7. Property history
          8. Investment potential
          9. Lifestyle benefits
          10. Future development plans`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    let generatedStructure;
    try {
      const responseContent = completion.choices[0].message.content;
      console.log('AI Response:', responseContent);
      
      generatedStructure = JSON.parse(responseContent);
      
      // Ensure we have at least 10 sections
      if (!generatedStructure?.layout?.sections || generatedStructure.layout.sections.length < 10) {
        const fallbackSections = createComprehensiveFallbackSections(propertyData);
        generatedStructure = {
          layout: {
            sections: fallbackSections,
            globalStyles: createFallbackStructure(propertyData).layout.globalStyles
          }
        };
      }
    } catch (parseError) {
      console.log('Error parsing AI response:', parseError);
      const fallbackSections = createComprehensiveFallbackSections(propertyData);
      generatedStructure = {
        layout: {
          sections: fallbackSections,
          globalStyles: createFallbackStructure(propertyData).layout.globalStyles
        }
      };
    }

    // Add animations and interactions
    const enhancedStructure = {
      ...generatedStructure,
      layout: {
        ...generatedStructure.layout,
        sections: generatedStructure.layout.sections.map(section => ({
          ...section,
          id: section.id || uuidv4(),
          content: {
            ...section.content,
            elements: (section.content?.elements || []).map(element => ({
              ...element,
              id: element.id || uuidv4(),
              animation: element.animation || {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, ease: "easeOut" }
              },
              interaction: element.interaction || {
                whileHover: { scale: 1.02, transition: { duration: 0.2 } },
                whileTap: { scale: 0.98 }
              }
            }))
          }
        }))
      }
    };

    return new Response(JSON.stringify(enhancedStructure), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    // Return fallback structure with comprehensive sections
    const fallbackSections = createComprehensiveFallbackSections(propertyData);
    const fallbackStructure = {
      layout: {
        sections: fallbackSections,
        globalStyles: createFallbackStructure(propertyData).layout.globalStyles
      }
    };
    
    return new Response(JSON.stringify(fallbackStructure), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Function to create comprehensive fallback sections
function createComprehensiveFallbackSections(property: any) {
  return [
    {
      id: uuidv4(),
      type: 'hero',
      content: {
        title: property?.title || 'Luxurious Property',
        subtitle: `${property?.bedrooms} Beds • ${property?.bathrooms} Baths • ${property?.squareFootage} sq ft`,
        price: property?.price,
        background: { type: 'image', value: property?.images?.[0] }
      }
    },
    {
      id: uuidv4(),
      type: 'description',
      content: {
        title: 'Property Overview',
        text: `Experience luxury living in this stunning ${property?.bedrooms}-bedroom home.`,
        features: property?.features?.slice(0, 5) || []
      }
    },
    {
      id: uuidv4(),
      type: 'features',
      content: {
        title: 'Key Features & Amenities',
        features: property?.features || []
      }
    },
    {
      id: uuidv4(),
      type: 'gallery',
      content: {
        title: 'Property Gallery',
        images: property?.images || []
      }
    },
    {
      id: uuidv4(),
      type: 'location',
      content: {
        title: 'Location & Neighborhood',
        address: property?.address,
        description: 'Discover the perfect blend of convenience and tranquility.'
      }
    },
    {
      id: uuidv4(),
      type: 'floorplan',
      content: {
        title: 'Interactive Floor Plan',
        description: `Explore this ${property?.squareFootage} sq ft layout.`
      }
    },
    {
      id: uuidv4(),
      type: 'amenities',
      content: {
        title: 'Property Amenities',
        amenities: property?.features || [],
        description: 'Luxury features and modern conveniences.'
      }
    },
    {
      id: uuidv4(),
      type: 'stats',
      content: {
        title: 'Property Statistics',
        stats: [
          { label: 'Bedrooms', value: property?.bedrooms },
          { label: 'Bathrooms', value: property?.bathrooms },
          { label: 'Square Footage', value: property?.squareFootage },
          { label: 'Year Built', value: 'Recent' },
          { label: 'Lot Size', value: 'Spacious' },
          { label: 'Parking', value: 'Available' }
        ]
      }
    },
    {
      id: uuidv4(),
      type: 'video',
      content: {
        title: 'Video Tour',
        description: 'Take a virtual walkthrough of the property.',
        videoUrl: property?.videoUrl || ''
      }
    },
    {
      id: uuidv4(),
      type: 'contact',
      content: {
        title: 'Schedule a Viewing',
        description: 'Contact us to arrange a private showing.',
        form: {
          fields: ['name', 'email', 'phone', 'message']
        }
      }
    },
    {
      id: uuidv4(),
      type: 'similar',
      content: {
        title: 'Similar Properties',
        description: 'Explore other properties you might like.',
        properties: []
      }
    },
    {
      id: uuidv4(),
      type: 'testimonials',
      content: {
        title: 'What Our Clients Say',
        testimonials: [
          {
            text: 'Beautiful property with amazing amenities!',
            author: 'Recent Buyer'
          }
        ]
      }
    }
  ].map(section => ({
    ...section,
    style: {
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: section.type === 'hero' ? '4rem' : '2rem',
        fontWeight: '700',
        lineHeight: '1.2'
      },
      spacing: {
        padding: '4rem 2rem',
        margin: '0',
        gap: '2rem'
      },
      colors: {
        background: section.type === 'hero' ? '#1a1a1a' : '#ffffff',
        text: section.type === 'hero' ? '#ffffff' : '#1a1a1a',
        accent: '#3b82f6'
      }
    }
  }));
}