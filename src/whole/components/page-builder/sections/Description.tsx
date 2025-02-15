import React from 'react';

interface DescriptionProps {
  content: {
    text: string;
    highlights?: string[];
  };
}

export function Description({ content }: DescriptionProps) {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-lg">
          {content.text.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        {content.highlights && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Property Highlights</h3>
            <ul className="grid grid-cols-2 gap-4">
              {content.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 