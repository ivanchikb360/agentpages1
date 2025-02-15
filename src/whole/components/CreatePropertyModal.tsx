import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FileUpload } from './FileUpload';
import { generatePropertyContent } from '../services/ai-property';
import { X } from 'lucide-react';

interface PropertyInfo {
  title: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  address: string;
  description: string;
  features: string[];
  images: string[];
}

export function CreatePropertyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    title: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    address: '',
    description: '',
    features: [],
    images: [],
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Property info before save:', {
        ...propertyInfo,
        images: propertyInfo.images,
      });

      // 1. Save property info to database
      const { data: pageData, error: pageError } = await supabase
        .from('landing_pages')
        .insert({
          user_id: user?.id,
          title: propertyInfo.title,
          status: 'draft',
          property_data: {
            ...propertyInfo,
            images: propertyInfo.images.map(
              (img: string | { path?: string; url?: string }) =>
                typeof img === 'string' ? img : img.path || img.url || ''
            ),
          },
        })
        .select()
        .single();

      if (pageError) throw pageError;
      console.log('Saved page data:', pageData);

      // 2. Generate AI content
      const aiContent = await generatePropertyContent(propertyInfo, {
        colors: {
          primary: '#2563eb',
          background: '#ffffff',
        },
      });

      // 3. Update the page with AI content
      const { error: updateError } = await supabase
        .from('landing_pages')
        .update({
          content: aiContent.layout.sections,
        })
        .eq('id', pageData.id);

      if (updateError) throw updateError;

      toast.success('Property page created successfully!');
      onClose();
      navigate(`/dashboard/page-builder/${pageData.id}`);
    } catch (error: any) {
      console.error('Error creating property page:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Property Landing Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={propertyInfo.title}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={propertyInfo.price}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={propertyInfo.bedrooms}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    bedrooms: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={propertyInfo.bathrooms}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    bathrooms: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage</Label>
              <Input
                id="squareFootage"
                type="number"
                value={propertyInfo.squareFootage}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    squareFootage: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={propertyInfo.address}
                onChange={(e) =>
                  setPropertyInfo((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              value={propertyInfo.description}
              onChange={(e) =>
                setPropertyInfo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Key Features (comma-separated)</Label>
            <Textarea
              id="features"
              value={propertyInfo.features.join(', ')}
              onChange={(e) =>
                setPropertyInfo((prev) => ({
                  ...prev,
                  features: e.target.value.split(',').map((f) => f.trim()),
                }))
              }
              rows={2}
              placeholder="e.g., Hardwood floors, Updated kitchen, Pool"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Property Images</Label>
            <FileUpload
              landingPageId={undefined} // Fixing the 'pageId' reference
              onUpload={(urls) => {
                console.log('Uploaded image URLs:', urls);
                setPropertyInfo((prev) => {
                  const newImages = [...(prev.images || []), ...urls]; // Ensuring prev.images is defined
                  console.log('Updated property images:', newImages);
                  return { ...prev, images: newImages };
                });
              }}
              maxFiles={10}
              accept="image/*"
            />
            {propertyInfo.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {propertyInfo.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      onClick={() => {
                        setPropertyInfo((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
