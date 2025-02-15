import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Dialog, DialogContent } from '../../ui/dialog';
import { Expand, BedDouble, Bath, Square } from 'lucide-react';

interface FloorPlanProps {
  content: {
    title?: string;
    plans: Array<{
      name: string;
      image: string;
      bedrooms: string;
      bathrooms: string;
      squareFeet: string;
      details?: string[];
    }>;
  };
}

export function FloorPlan({ content }: FloorPlanProps) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const defaultContent = {
    title: 'Floor Plans',
    plans: [
      {
        name: 'Main Floor',
        image: '/placeholder.jpg',
        bedrooms: '3',
        bathrooms: '2',
        squareFeet: '1,500',
        details: ['Open Concept Living', 'Gourmet Kitchen', 'Master Suite'],
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mergedContent.plans.map((plan, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative aspect-[4/3] group cursor-pointer">
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setSelectedPlan(index)}
                  >
                    <Expand className="mr-2 h-4 w-4" />
                    View Plan
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{plan.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{plan.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{plan.squareFeet} ft²</span>
                  </div>
                </div>
                {plan.details && (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>• {detail}</li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedPlan !== null}
        onOpenChange={() => setSelectedPlan(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedPlan !== null && (
            <img
              src={mergedContent.plans[selectedPlan].image}
              alt={mergedContent.plans[selectedPlan].name}
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 