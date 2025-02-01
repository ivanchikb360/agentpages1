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