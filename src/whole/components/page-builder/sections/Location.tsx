import React from 'react';

interface LocationProps {
  content: {
    title?: string;
    address: string;
    mapUrl?: string;
    nearbyPlaces?: Array<{
      category: string;
      places: Array<{
        name: string;
        distance: string;
      }>;
    }>;
  };
}

export function Location({ content }: LocationProps) {
  const defaultContent = {
    title: 'Location',
    mapUrl: 'https://maps.google.com/embed?q=' + encodeURIComponent(content.address),
    nearbyPlaces: [
      {
        category: 'Transportation',
        places: [
          { name: 'Bus Station', distance: '0.2 miles' },
          { name: 'Train Station', distance: '0.5 miles' },
        ],
      },
      {
        category: 'Education',
        places: [
          { name: 'Elementary School', distance: '0.3 miles' },
          { name: 'High School', distance: '0.8 miles' },
        ],
      },
    ],
  };

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {mergedContent.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square">
            <iframe
              src={mergedContent.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-6">Nearby Places</h3>
            <div className="space-y-8">
              {mergedContent.nearbyPlaces?.map((category, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-3">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.places.map((place, placeIndex) => (
                      <li
                        key={placeIndex}
                        className="flex justify-between items-center"
                      >
                        <span>{place.name}</span>
                        <span className="text-gray-500">{place.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 