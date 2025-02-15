import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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
    photo?: string;
  };
}

interface QuickInfoContent {
  highlights: Array<{
    icon: string;
    value: string;
    label: string;
  }>;
  callouts: Array<{
    title: string;
    value: string;
  }>;
}

interface AIGeneratedSection {
  id: string;
  type: string;
  content: HeroContent | GalleryContent | DescriptionContent | AmenitiesContent | LocationContent | ContactSectionContent | QuickInfoContent;
  style: {
    padding?: string;
    margin?: string;
    background?: string;
    borderRadius?: string;
    minHeight?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    gridGap?: string;
    aspectRatio?: string;
    display?: string;
    flexDirection?: string;
    gap?: string;
    gridTemplateColumns?: string;
    '@media (max-width: 768px)'?: {
      gridTemplateColumns: string;
    };
  };
}

interface HeroContent {
  title: string;
  subtitle: string;
  price: string;
  background: {
    type: string;
    value: string;
    fallback: string;
  };
  cta: {
    primary: string;
    secondary: string;
  };
  badges: Array<{label: string, type: string}>;
}

interface GalleryContent {
  images: Array<{
    url: string;
    alt: string;
    caption: string;
  }>;
  layout: string;
  enableLightbox: boolean;
  enableThumbnails: boolean;
}

interface DescriptionContent {
  title: string;
  text: string;
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

interface AmenitiesContent {
  title: string;
  categories: Array<{
    category: string;
    features: string[];
  }>;
  layout: string;
  showIcons: boolean;
}

interface LocationContent {
  address: string;
  highlights: string;
  mapEnabled: boolean;
  nearbyAttractions: Array<{
    name: string;
    distance: string;
    type: string;
  }>;
  walkScore: {
    walkScore: number;
    transitScore: number;
    bikeScore: number;
  };
}

interface ContactSectionContent {
  title: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    photo?: string;
    role: string;
    availability: ReturnType<typeof generateAgentAvailability>;
    reviews: Awaited<ReturnType<typeof generateAgentReviews>>;
  };
  form: {
    fields: Array<{
      type: string;
      label: string;
      required: boolean;
    }>;
    submitLabel: string;
  };
  alternativeContact: {
    phone: string;
    email: string;
    hours: string;
  };
}

interface DesignPreferences {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    text?: string;
    background?: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    baseSize?: string;
  };
  spacing?: {
    padding?: string;
    margin?: string;
    sectionPadding?: string;
    contentWidth?: string;
  };
  borderRadius?: string;
  animations?: {
    type?: 'fade' | 'slide' | 'none';
    duration?: string;
  };
}

interface ContentLayout {
  sections: AIGeneratedSection[];
  globalStyles: GlobalStyles;
}

interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
  spacing: {
    sectionPadding: string;
    contentWidth: string;
  };
  animations: {
    type: 'fade' | 'slide' | 'none';
    duration: string;
  };
}

function mergeContent(
  enhanced: { layout: ContentLayout },
  aiGenerated: { layout?: Partial<ContentLayout> }
): { layout: ContentLayout } {
  return {
    layout: {
      sections: [
        ...enhanced.layout.sections,
        ...(aiGenerated?.layout?.sections || [])
      ],
      globalStyles: {
        ...enhanced.layout.globalStyles,
        ...(aiGenerated?.layout?.globalStyles || {})
      }
    }
  };
}

export async function generatePropertyContent(propertyData: PropertyData, designPreferences: DesignPreferences) {
  // Ensure property data has all required fields with fallbacks
  const sanitizedData = {
    title: propertyData.title || 'Beautiful Property',
    price: propertyData.price || '0',
    bedrooms: propertyData.bedrooms || '0',
    bathrooms: propertyData.bathrooms || '0',
    squareFootage: propertyData.squareFootage || '0',
    description: propertyData.description || 'A wonderful property in a great location.',
    features: propertyData.features || [],
    images: propertyData.images || ['/placeholder-hero.jpg'],
    address: propertyData.address || 'Location available upon request',
    agent: propertyData.agent || {
      name: 'Contact Agent',
      phone: 'Available upon request',
      email: 'contact@example.com'
    }
  };

  // Generate all required sections with proper content
  const sections: AIGeneratedSection[] = [
    // Hero Section
    {
      id: uuidv4(),
      type: 'hero',
      content: {
        title: sanitizedData.title,
        subtitle: `${sanitizedData.bedrooms} Beds • ${sanitizedData.bathrooms} Baths • ${sanitizedData.squareFootage} sq ft`,
        price: formatPrice(sanitizedData.price),
        background: {
          type: 'image',
          value: sanitizedData.images[0],
          fallback: '/placeholder-hero.jpg'
        },
        cta: {
          primary: 'Schedule Viewing',
          secondary: 'Virtual Tour'
        },
        badges: generatePropertyBadges(sanitizedData)
      } as HeroContent,
      style: generateSectionStyle('hero', designPreferences)
    },

    // Quick Info Section
    {
      id: uuidv4(),
      type: 'quickInfo',
      content: {
        highlights: [
          { icon: 'bed', value: sanitizedData.bedrooms, label: 'Bedrooms' },
          { icon: 'bath', value: sanitizedData.bathrooms, label: 'Bathrooms' },
          { icon: 'ruler', value: sanitizedData.squareFootage, label: 'Sq Ft' }
        ],
        callouts: generatePropertyCallouts(sanitizedData)
      } as QuickInfoContent,
      style: generateSectionStyle('quickInfo', designPreferences)
    },

    // Gallery Section
    {
      id: uuidv4(),
      type: 'gallery',
      content: {
        images: sanitizedData.images.map(url => ({
          url,
          alt: generateImageAltText(sanitizedData, url),
          caption: generateImageCaption(sanitizedData, url)
        })),
        layout: 'grid',
        enableLightbox: true,
        enableThumbnails: true
      } as GalleryContent,
      style: generateSectionStyle('gallery', designPreferences)
    },

    // Description Section
    {
      id: uuidv4(),
      type: 'description',
      content: {
        title: 'Property Overview',
        text: generatePropertyDescription(sanitizedData),
        highlights: sanitizedData.features.slice(0, 3).map(feature => ({
          icon: getFeatureIcon(feature),
          title: feature,
          description: generateFeatureDescription(feature)
        })),
        sections: [
          {
            title: 'About the Property',
            content: sanitizedData.description
          }
        ]
      } as DescriptionContent,
      style: generateSectionStyle('description', designPreferences)
    },

    // Amenities Section
    {
      id: uuidv4(),
      type: 'amenities',
      content: {
        title: 'Property Features & Amenities',
        categories: categorizeFeatures(sanitizedData.features),
        layout: 'grid',
        showIcons: true
      } as AmenitiesContent,
      style: generateSectionStyle('amenities', designPreferences)
    },

    // Location Section
    {
      id: uuidv4(),
      type: 'location',
      content: {
        address: sanitizedData.address,
        highlights: await generateLocationHighlights(sanitizedData.address),
        mapEnabled: true,
        nearbyAttractions: await generateNearbyAttractions(sanitizedData.address),
        walkScore: await getWalkScore(sanitizedData.address)
      } as LocationContent,
      style: generateSectionStyle('location', designPreferences)
    },

    // Contact Section
    {
      id: uuidv4(),
      type: 'contact',
      content: {
        title: 'Contact Agent',
        agent: {
          name: sanitizedData.agent.name,
          phone: sanitizedData.agent.phone,
          email: sanitizedData.agent.email,
          photo: sanitizedData.agent.photo,
          role: 'Property Agent',
          availability: generateAgentAvailability(),
          reviews: await generateAgentReviews(sanitizedData.agent)
        },
        form: {
          fields: [
            { type: 'text', label: 'Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'phone', label: 'Phone', required: false },
            { type: 'textarea', label: 'Message', required: true }
          ],
          submitLabel: 'Send Message'
        },
        alternativeContact: {
          phone: sanitizedData.agent.phone,
          email: sanitizedData.agent.email,
          hours: 'Mon-Fri: 9AM-6PM'
        }
      } as ContactSectionContent,
      style: generateSectionStyle('contact', designPreferences)
    }
  ];

  return {
    layout: {
      sections,
      globalStyles: generateGlobalStyles(designPreferences)
    }
  };
}

// Helper functions

function generatePropertyDescription(propertyData: PropertyData): string {
  const highlights = propertyData.features.slice(0, 3).join(', ');
  return `
    Experience luxury living in this stunning ${propertyData.bedrooms}-bedroom home, 
    offering ${propertyData.squareFootage} square feet of meticulously designed space. 
    This exceptional property showcases ${highlights} among its premium features.

    Perfectly situated in ${propertyData.address}, residents enjoy both convenience 
    and tranquility. The thoughtful layout and premium finishes throughout make 
    this property an ideal place to call home.
  `.trim().replace(/\s+/g, ' ');
}

function formatPrice(price: string): string {
  const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(numPrice);
}

function generatePropertyBadges(propertyData: PropertyData): Array<{label: string, type: string}> {
  const badges = [];
  
  // Add property type badge
  if (propertyData.title.toLowerCase().includes('house')) {
    badges.push({ label: 'Single Family Home', type: 'property-type' });
  } else if (propertyData.title.toLowerCase().includes('condo')) {
    badges.push({ label: 'Condominium', type: 'property-type' });
  }

  // Add feature badges
  const premiumFeatures = ['pool', 'waterfront', 'view', 'luxury'];
  propertyData.features.forEach(feature => {
    if (premiumFeatures.some(pf => feature.toLowerCase().includes(pf))) {
      badges.push({ label: feature, type: 'feature' });
    }
  });

  return badges;
}

function generateSectionStyle(sectionType: string, preferences: DesignPreferences): AIGeneratedSection['style'] {
  const baseStyle = {
    padding: preferences?.spacing?.padding || '2rem',
    margin: preferences?.spacing?.margin || '1rem',
    background: preferences?.colors?.background || '#ffffff',
    borderRadius: preferences?.borderRadius || '0.5rem',
  };

  // Add section-specific styles
  switch (sectionType) {
    case 'hero':
      return {
        ...baseStyle,
        minHeight: '80vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    case 'gallery':
      return {
        ...baseStyle,
        gridGap: '1rem',
        aspectRatio: '16/9',
      };
    case 'description':
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        background: preferences?.colors?.background || '#f8fafc',
        display: 'grid',
        gap: '2rem',
      };
    case 'amenities':
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        background: preferences?.colors?.background || '#ffffff',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
      };
    case 'quickInfo':
      return {
        ...baseStyle,
        padding: '3rem 2rem',
        background: preferences?.colors?.background || '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      };
    case 'location':
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        background: preferences?.colors?.background || '#ffffff',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
        },
      };
    case 'contact':
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        background: preferences?.colors?.background || '#f8fafc',
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gap: '3rem',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr',
        },
      };
    default:
      return baseStyle;
  }
}

async function retryWithBackoff(fn: () => Promise<any>, maxRetries: number): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

async function generateLocationHighlights(address: string): Promise<string> {
  // This would typically call a geocoding/location service API
  // For now, return a generic description
  return `
    Located in a prime area, this property offers easy access to local amenities,
    shopping, and dining. The neighborhood features excellent schools and parks,
    making it perfect for families and professionals alike.
  `.trim();
}

function generatePropertyCallouts(propertyData: PropertyData): Array<{title: string, value: string}> {
  return [
    { title: 'Year Built', value: 'Recent' },
    { title: 'Property Type', value: propertyData.title.includes('condo') ? 'Condominium' : 'Single Family Home' },
    { title: 'Lot Size', value: 'Spacious' },
    { title: 'Parking', value: 'Available' }
  ];
}

function generateImageAltText(propertyData: PropertyData, imageUrl: string): string {
  const baseAlt = `${propertyData.bedrooms} bedroom property in ${propertyData.address}`;
  if (imageUrl.toLowerCase().includes('kitchen')) return `${baseAlt} - Kitchen View`;
  if (imageUrl.toLowerCase().includes('bath')) return `${baseAlt} - Bathroom`;
  if (imageUrl.toLowerCase().includes('bed')) return `${baseAlt} - Bedroom`;
  return baseAlt;
}

function generateImageCaption(propertyData: PropertyData, imageUrl: string): string {
  if (imageUrl.toLowerCase().includes('kitchen')) return 'Modern Kitchen with Premium Appliances';
  if (imageUrl.toLowerCase().includes('bath')) return 'Luxurious Bathroom';
  if (imageUrl.toLowerCase().includes('bed')) return 'Spacious Bedroom';
  return 'Property View';
}

function getFeatureIcon(feature: string): string {
  const iconMap: Record<string, string> = {
    'pool': 'swim',
    'garage': 'car',
    'garden': 'flower',
    'security': 'shield',
    'air conditioning': 'snowflake',
    'heating': 'thermometer',
    'fireplace': 'flame',
    'view': 'eye',
    'parking': 'parking',
    'storage': 'box',
    'gym': 'dumbbell',
    'elevator': 'arrow-up-down'
  };

  const matchedKey = Object.keys(iconMap).find(key => 
    feature.toLowerCase().includes(key.toLowerCase())
  );
  
  return matchedKey ? iconMap[matchedKey] : 'check';
}

function generateFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    'pool': 'Enjoy resort-style living with a pristine swimming pool',
    'garage': 'Secure parking space for your vehicles',
    'garden': 'Beautiful landscaped garden perfect for outdoor relaxation',
    'security': '24/7 security system for your peace of mind',
    'air conditioning': 'Modern climate control system throughout',
    'heating': 'Efficient heating system for year-round comfort',
    'fireplace': 'Cozy fireplace for warm gatherings',
    'view': 'Stunning views from your windows',
    'parking': 'Convenient parking space included',
    'storage': 'Ample storage space for your belongings',
    'gym': 'Stay fit with the on-site fitness facility',
    'elevator': 'Easy access with modern elevator'
  };

  const matchedKey = Object.keys(descriptions).find(key => 
    feature.toLowerCase().includes(key.toLowerCase())
  );
  
  return matchedKey ? descriptions[matchedKey] : `High-quality ${feature} for your comfort`;
}

function categorizeFeatures(features: string[]): Array<{category: string, features: string[]}> {
  const categories = {
    'Interior': ['fireplace', 'hardwood', 'kitchen', 'floor', 'ceiling'],
    'Exterior': ['pool', 'garden', 'patio', 'garage', 'view'],
    'Comfort': ['air conditioning', 'heating', 'cooling'],
    'Security': ['security', 'camera', 'alarm', 'gate'],
    'Amenities': ['gym', 'spa', 'elevator', 'storage']
  };

  const categorized = Object.entries(categories).map(([category, keywords]) => ({
    category,
    features: features.filter(feature => 
      keywords.some(keyword => feature.toLowerCase().includes(keyword))
    )
  }));

  // Add uncategorized features to "Other" category
  const categorizedFeatures = categorized.flatMap(cat => cat.features);
  const uncategorizedFeatures = features.filter(feature => 
    !categorizedFeatures.includes(feature)
  );

  if (uncategorizedFeatures.length > 0) {
    categorized.push({
      category: 'Other',
      features: uncategorizedFeatures
    });
  }

  return categorized.filter(cat => cat.features.length > 0);
}

async function generateNearbyAttractions(address: string): Promise<Array<{name: string, distance: string, type: string}>> {
  // This would typically call a places API
  return [
    { name: 'Local Shopping Center', distance: '0.5 miles', type: 'shopping' },
    { name: 'Central Park', distance: '0.8 miles', type: 'recreation' },
    { name: 'Downtown District', distance: '1.2 miles', type: 'entertainment' },
    { name: 'Public Transit Station', distance: '0.3 miles', type: 'transportation' }
  ];
}

async function getWalkScore(address: string): Promise<{
  walkScore: number,
  transitScore: number,
  bikeScore: number
}> {
  // This would typically call the WalkScore API
  return {
    walkScore: 85,
    transitScore: 78,
    bikeScore: 72
  };
}

function generateAgentAvailability(): {
  schedule: Array<{day: string, hours: string}>,
  nextAvailable: string
} {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return {
    schedule: days.map(day => ({
      day,
      hours: '9:00 AM - 6:00 PM'
    })),
    nextAvailable: 'Tomorrow at 10:00 AM'
  };
}

async function generateAgentReviews(agent: PropertyData['agent']): Promise<Array<{
  rating: number,
  comment: string,
  author: string,
  date: string
}>> {
  // This would typically fetch from a reviews database
  return [
    {
      rating: 5,
      comment: 'Excellent service and very professional',
      author: 'John D.',
      date: '2 months ago'
    },
    {
      rating: 4,
      comment: 'Very knowledgeable about the area',
      author: 'Sarah M.',
      date: '3 months ago'
    }
  ];
}

function generateGlobalStyles(preferences: DesignPreferences): GlobalStyles {
  return {
    colors: {
      primary: preferences?.colors?.primary || '#2563eb',
      secondary: preferences?.colors?.secondary || '#4f46e5',
      accent: preferences?.colors?.accent || '#f59e0b',
      text: preferences?.colors?.text || '#1f2937',
      background: preferences?.colors?.background || '#ffffff'
    },
    typography: {
      headingFont: preferences?.typography?.headingFont || 'Inter',
      bodyFont: preferences?.typography?.bodyFont || 'Inter',
      baseSize: preferences?.typography?.baseSize || '16px'
    },
    spacing: {
      sectionPadding: preferences?.spacing?.sectionPadding || '4rem',
      contentWidth: preferences?.spacing?.contentWidth || '1200px'
    },
    animations: {
      type: preferences?.animations?.type || 'fade',
      duration: preferences?.animations?.duration || '0.3s'
    }
  };
} 