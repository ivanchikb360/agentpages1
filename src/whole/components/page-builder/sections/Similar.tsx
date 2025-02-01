import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { BedDouble, Bath, Square, ArrowRight } from 'lucide-react';

interface SimilarProps {
  content: {
    title?: string;
    subtitle?: string;
    properties: Array<{
      title: string;
      price: string;
      image: string;
      bedrooms: string;
      bathrooms: string;
      squareFeet: string;
      address: string;
      link?: string;
    }>;
  };
}

export function Similar({ content }: SimilarProps) {
  const defaultContent = {
    title: 'Similar Properties',
    subtitle: 'You might also be interested in these properties',
    properties: [
      {
        title: 'Modern Family Home',
        price: '$550,000',
        image: '/placeholder.jpg',
        bedrooms: '3',
        bathrooms: '2',
        squareFeet: '2,000',
        address: '123 Example St, City, State',
      },
      {
        title: 'Luxury Townhouse',
        price: '$625,000',
        image: '/placeholder.jpg',
        bedrooms: '4',
        bathrooms: '3',
        squareFeet: '2,200',
        address: '456 Sample Ave, City, State',
      },
      {
        title: 'Urban Condo',
        price: '$475,000',
        image: '/placeholder.jpg',
        bedrooms: '2',
        bathrooms: '2',
        squareFeet: '1,500',
        address: '789 Test Blvd, City, State',
      },
    ],
  };

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{mergedContent.title}</h2>
          <p className="text-gray-600">{mergedContent.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {mergedContent.properties.map((property, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                  {property.price}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{property.address}</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{property.squareFeet}</span>
                  </div>
                </div>
                {property.link && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = property.link}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 