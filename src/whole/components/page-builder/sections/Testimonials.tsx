import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  content: {
    title?: string;
    subtitle?: string;
    testimonials: Array<{
      text: string;
      author: string;
      role?: string;
      rating?: number;
      image?: string;
      date?: string;
    }>;
  };
}

export function Testimonials({ content }: TestimonialsProps) {
  const defaultContent = {
    title: 'What People Say',
    subtitle: 'Hear from our satisfied clients',
    testimonials: [
      {
        text: "We couldn't be happier with our new home. The location is perfect and the amenities are exactly what we were looking for.",
        author: 'Sarah Johnson',
        role: 'Homeowner',
        rating: 5,
        date: '2 months ago',
      },
      {
        text: 'The property exceeded our expectations. Modern features with classic charm - exactly what we wanted.',
        author: 'Michael Chen',
        role: 'Recent Buyer',
        rating: 5,
        date: '1 month ago',
      },
      {
        text: 'A wonderful community and beautiful home. The whole buying process was smooth and professional.',
        author: 'Emma Thompson',
        role: 'Resident',
        rating: 5,
        date: '3 months ago',
      },
    ],
  };

  const mergedContent = { ...defaultContent, ...content };

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{mergedContent.title}</h2>
          <p className="text-gray-600">{mergedContent.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {mergedContent.testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-500 mb-4 opacity-50" />
                <p className="text-gray-700 mb-4">{testimonial.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-500 font-semibold">
                          {testimonial.author[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      {testimonial.role && (
                        <div className="text-sm text-gray-500">
                          {testimonial.role}
                        </div>
                      )}
                    </div>
                  </div>
                  {testimonial.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {testimonial.rating}
                      </span>
                    </div>
                  )}
                </div>
                {testimonial.date && (
                  <div className="absolute top-6 right-6 text-sm text-gray-400">
                    {testimonial.date}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 