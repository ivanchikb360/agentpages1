import React from 'react';

interface HeroProps {
  content: {
    title: string;
    subtitle?: string;
    image: string;
    price?: string;
    bedsBaths?: string;
  };
}

export function Hero({ content }: HeroProps) {
  return (
    <div className="relative h-[70vh] min-h-[600px]">
      <img
        src={content.image}
        alt={content.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">{content.title}</h1>
          {content.subtitle && (
            <p className="text-xl mb-4 text-gray-200">{content.subtitle}</p>
          )}
          <div className="flex items-center gap-6">
            {content.price && (
              <span className="text-3xl font-semibold">${content.price}</span>
            )}
            {content.bedsBaths && (
              <span className="text-xl text-gray-200">{content.bedsBaths}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
