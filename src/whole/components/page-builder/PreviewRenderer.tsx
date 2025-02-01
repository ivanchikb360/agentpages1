import React from 'react';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Gallery } from './sections/Gallery';
import { Description } from './sections/Description';
import { Contact } from './sections/Contact';

const sectionComponents = {
  hero: Hero,
  features: Features,
  gallery: Gallery,
  description: Description,
  contact: Contact,
} as const;

interface PreviewRendererProps {
  content: any[];
  propertyData: any;
}

export function PreviewRenderer({
  content,
  propertyData,
}: PreviewRendererProps) {
  return (
    <div className="min-h-screen">
      {content.map((section) => {
        const Component =
          sectionComponents[section.type as keyof typeof sectionComponents];
        if (!Component) return null;

        return (
          <div key={section.id} className="preview-section">
            <Component content={section.content} />
          </div>
        );
      })}
    </div>
  );
}
