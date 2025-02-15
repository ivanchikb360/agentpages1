import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from './Hero';
import { Features } from './Features';
import { Gallery } from './Gallery';
import { Description } from './Description';
import { Contact } from './Contact';
import { Amenities } from './Amenities';
import { Location } from './Location';
import { Neighborhood } from './Neighborhood';
import { FloorPlan } from './FloorPlan';
import { Testimonials } from './Testimonials';
import { Similar } from './Similar';
import {
  CheckCircle,
  MapPin,
  Star,
  Home,
  Calendar,
  ChartBar,
  Video,
  Phone,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../../lib/utils';

interface SectionProps {
  type: string;
  content: any;
  isSelected?: boolean;
}

export function Section({ type, content, isSelected }: SectionProps) {
  const renderSection = () => {
    switch (type) {
      case 'hero':
        return (
          <div className="relative h-[70vh] flex items-center">
            {content.background && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${content.background.value})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            <div className="relative z-10 container mx-auto px-4 text-white">
              <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
              <p className="text-xl mb-6">{content.subtitle}</p>
              <div className="text-3xl font-semibold">{content.price}</div>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
            <p className="text-lg mb-8">{content.description}</p>
            {content.highlights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.highlights.map((highlight: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Star className="text-yellow-500" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h2 className="text-3xl font-semibold mb-8">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.features?.map((feature: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg"
                >
                  <CheckCircle className="text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="py-12 px-4">
            <h2 className="text-3xl font-semibold mb-8 text-center">
              {content.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {content.images?.map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="aspect-video relative overflow-hidden rounded-lg"
                >
                  <img
                    src={image}
                    alt={`Property image ${idx + 1}`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <div className="flex items-start gap-4 mb-8">
                <MapPin className="text-blue-500 mt-1" />
                <div>
                  <p className="text-lg font-medium">{content.address}</p>
                  <p className="text-gray-600">{content.description}</p>
                </div>
              </div>
              <div className="h-[400px] bg-gray-200 rounded-lg">
                {/* Map component would go here */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Interactive Map</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'floorplan':
        return (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Interactive Floor Plan</p>
              </div>
            </div>
          </div>
        );

      case 'neighborhood':
        return (
          <div className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for neighborhood amenities */}
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-lg shadow-sm">
                    <Home className="text-blue-500 mb-2" />
                    <h3 className="font-medium">Local Amenity</h3>
                    <p className="text-gray-600">Within 0.5 miles</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'market':
        return (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <ChartBar className="text-blue-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Current Value</h3>
                  <p className="text-2xl font-bold">{content.price}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Calendar className="text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Market Trends</h3>
                  <p className="text-gray-600">Appreciating Area</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'virtual':
        return (
          <div className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                <Video className="text-gray-400 w-16 h-16" />
              </div>
              <Button size="lg">Start Virtual Tour</Button>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Phone className="text-blue-500 mb-4" />
                  <h3 className="text-xl font-medium mb-4">
                    Contact Information
                  </h3>
                  <Button size="lg" className="w-full">
                    Schedule Viewing
                  </Button>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <Calendar className="text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-4">Available Times</h3>
                  <Button size="lg" variant="outline" className="w-full">
                    View Calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'similar':
        return (
          <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder for similar properties */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4">
                      <h3 className="font-medium">Similar Property</h3>
                      <p className="text-gray-600">Comparable Features</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'investment':
        return (
          <div className="py-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold mb-6">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="text-xl font-medium mb-2">ROI Potential</h3>
                  <p className="text-gray-600">Strong Growth Area</p>
                </div>
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Rental Yield</h3>
                  <p className="text-gray-600">Attractive Returns</p>
                </div>
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Future Value</h3>
                  <p className="text-gray-600">Appreciating Market</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-500">Unknown section type: {type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'section',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {renderSection()}
    </div>
  );
}
