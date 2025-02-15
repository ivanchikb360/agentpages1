import React from 'react';
import { Section } from './sections';

interface PreviewRendererProps {
  content: any[];
  propertyData: any;
}

export function PreviewRenderer({
  content,
  propertyData,
}: PreviewRendererProps) {
  console.log('PreviewRenderer content:', content); // Debug log

  return (
    <div className="min-h-screen">
      {content.map((section) => {
        console.log('Rendering section:', section); // Debug log
        return (
          <div key={section.id} className="preview-section">
            <Section type={section.type} content={section.content} />
          </div>
        );
      })}
    </div>
  );
}
