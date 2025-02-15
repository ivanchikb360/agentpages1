import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Check } from 'lucide-react';

interface AmenitiesProps {
  content: {
    title?: string;
    amenities: Array<{
      category: string;
      items: string[];
    }>;
  };
}

export function Amenities({ content }: AmenitiesProps) {
  const defaultContent = {
    title: 'Property Amenities',
    amenities: [
      {
        category: 'Interior',
        items: ['Central Air', 'Hardwood Floors', 'Walk-in Closets'],
      },
      {
        category: 'Exterior',
        items: ['2-Car Garage', 'Swimming Pool', 'Landscaped Garden'],
      },
      {
        category: 'Community',
        items: ['24/7 Security', 'Fitness Center', 'Tennis Court'],
      },
    ],
  };

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {mergedContent.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {mergedContent.amenities.map((category, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 