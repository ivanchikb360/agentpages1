import React from 'react';
import { Card, CardContent } from '../../ui/card';

interface Feature {
  title: string;
  value: string;
}

interface FeaturesProps {
  content: {
    features?: Feature[];
  };
}

export function Features({ content = { features: [] } }: FeaturesProps) {
  // Ensure features is always an array
  const features = Array.isArray(content?.features) ? content.features : [];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 