import React from 'react';
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
          <Hero
            content={{
              title: content.title || 'Beautiful Property',
              subtitle: content.subtitle,
              image: content.image || '/placeholder.jpg',
              price: content.price,
              bedsBaths: `${content.bedrooms} Beds • ${content.bathrooms} Baths • ${content.squareFootage} sq ft`,
            }}
          />
        );

      case 'features':
        return (
          <Features
            content={{
              features: [
                { title: 'Bedrooms', value: content.bedrooms },
                { title: 'Bathrooms', value: content.bathrooms },
                {
                  title: 'Square Footage',
                  value: `${content.squareFootage} sq ft`,
                },
              ],
            }}
          />
        );

      case 'gallery':
        return (
          <Gallery
            content={{
              images: content.images || [],
            }}
          />
        );

      case 'description':
        return (
          <Description
            content={{
              text: content.text || content.description || '',
              highlights: content.features || [],
            }}
          />
        );

      case 'contact':
        return (
          <Contact
            content={{
              agent: {
                name: content.agentName || 'John Doe',
                phone: content.agentPhone || '(555) 123-4567',
                email: content.agentEmail || 'agent@example.com',
                hours: content.agentHours || '9 AM - 6 PM',
                photo: content.agentPhoto,
              },
              form: {
                title: 'Schedule a Viewing',
                fields: [
                  { type: 'text', label: 'Name', required: true },
                  { type: 'email', label: 'Email', required: true },
                  { type: 'phone', label: 'Phone' },
                  { type: 'textarea', label: 'Message', required: true },
                ],
              },
            }}
          />
        );

      case 'amenities':
        return <Amenities content={content} />;
      case 'location':
        return <Location content={content} />;
      case 'neighborhood':
        return <Neighborhood content={content} />;
      case 'floorplan':
        return <FloorPlan content={content} />;
      case 'testimonials':
        return <Testimonials content={content} />;
      case 'similar':
        return <Similar content={content} />;

      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 rounded">
            <p className="text-gray-500">Unknown section type: {type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
    >
      {renderSection()}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 text-xs rounded">
          {type}
        </div>
      )}
    </div>
  );
}
