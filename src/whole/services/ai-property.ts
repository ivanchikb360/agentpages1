import { supabase } from '../../lib/supabase';

interface PropertyData {
  title: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  description: string;
  features: string[];
  images: string[];
  address: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

export async function generatePropertyContent(propertyData: PropertyData) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ai-content', {
      body: {
        type: 'property_content',
        data: propertyData
      }
    });

    if (error) throw error;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export const generateAIContent = async (propertyInfo: any) => {
  // Mock AI content generation for now
  return {
    hero: {
      title: `Beautiful ${propertyInfo.bedrooms} Bedroom Home`,
      subtitle: `Located in ${propertyInfo.address}`,
      image: propertyInfo.images[0] || '',
      price: propertyInfo.price,
    },
    features: {
      bedrooms: propertyInfo.bedrooms,
      bathrooms: propertyInfo.bathrooms,
      squareFootage: propertyInfo.squareFootage,
    },
    description: {
      text: propertyInfo.description,
      highlights: propertyInfo.features,
    },
    amenities: propertyInfo.features.map((feature: string) => ({
      title: feature,
      icon: 'check'
    })),
    pricing: {
      price: propertyInfo.price,
      details: `${propertyInfo.bedrooms} beds • ${propertyInfo.bathrooms} baths • ${propertyInfo.squareFootage} sqft`,
    }
  };
}; 