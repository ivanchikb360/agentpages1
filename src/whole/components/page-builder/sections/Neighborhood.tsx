import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Star, Coffee, ShoppingBag, Utensils, Trees } from 'lucide-react';

interface NeighborhoodProps {
  content: {
    title?: string;
    description?: string;
    rating?: number;
    highlights: Array<{
      title: string;
      description: string;
      icon?: 'coffee' | 'shopping' | 'dining' | 'parks';
    }>;
  };
}

export function Neighborhood({ content }: NeighborhoodProps) {
  const defaultContent = {
    title: 'Neighborhood',
    description: 'A vibrant community with everything you need nearby',
    rating: 4.5,
    highlights: [
      {
        title: 'Cafes & Bars',
        description: 'Multiple coffee shops and bars within walking distance',
        icon: 'coffee',
      },
      {
        title: 'Shopping',
        description: 'Major shopping centers and boutiques nearby',
        icon: 'shopping',
      },
      {
        title: 'Dining',
        description: 'Wide variety of restaurants and cuisines',
        icon: 'dining',
      },
      {
        title: 'Parks & Recreation',
        description: 'Beautiful parks and recreational facilities',
        icon: 'parks',
      },
    ],
  };

  const mergedContent = { ...defaultContent, ...content };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'coffee':
        return <Coffee className="h-6 w-6 text-blue-500" />;
      case 'shopping':
        return <ShoppingBag className="h-6 w-6 text-blue-500" />;
      case 'dining':
        return <Utensils className="h-6 w-6 text-blue-500" />;
      case 'parks':
        return <Trees className="h-6 w-6 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{mergedContent.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {mergedContent.description}
          </p>
          {mergedContent.rating && (
            <div className="flex items-center justify-center mt-4">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-2 font-semibold">{mergedContent.rating}/5</span>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mergedContent.highlights.map((highlight, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4">{getIcon(highlight.icon)}</div>
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-gray-600 text-sm">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 