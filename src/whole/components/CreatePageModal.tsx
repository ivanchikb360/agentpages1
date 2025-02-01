import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { FileUpload } from './FileUpload';
import { ImagePreview } from './ImagePreview';
import { Home, DollarSign, Bed, Bath, Move, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PropertyData {
  title: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  address: string;
  description: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (data: PropertyData) => void;
}

export function CreatePageModal({
  isOpen,
  onClose,
  onCreatePage,
}: CreatePageModalProps) {
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState<PropertyData>({
    title: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    address: '',
    description: '',
    features: [],
    images: [],
    agent: {
      name: '',
      phone: '',
      email: '',
    },
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add validation
    if (!propertyData.title.trim()) {
      toast.error('Property title is required');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting form with data:', {
        ...propertyData,
        images: uploadedImages,
      });

      await onCreatePage({
        ...propertyData,
        title: propertyData.title.trim(), // Ensure title is trimmed
        images: uploadedImages,
      });

      resetForm();
    } catch (error) {
      console.error('Error in CreatePageModal:', error);
      toast.error('Failed to create page');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPropertyData({
      title: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      squareFootage: '',
      address: '',
      description: '',
      features: [],
      images: [],
      agent: { name: '', phone: '', email: '' },
    });
    setUploadedImages([]);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Property Page</DialogTitle>
          <DialogDescription>
            Fill in the property details to create your landing page. Our AI
            will help generate engaging content.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex justify-between mb-4">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  step >= stepNumber ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Property Details'}
            {step === 3 && 'Images & Final Steps'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  className="pl-10"
                  placeholder="Property Title"
                  value={propertyData.title}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  className="pl-10"
                  placeholder="Price"
                  value={propertyData.price}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  className="pl-10"
                  placeholder="Property Address"
                  value={propertyData.address}
                  onChange={(e) =>
                    setPropertyData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Bed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    className="pl-10"
                    placeholder="Bedrooms"
                    value={propertyData.bedrooms}
                    onChange={(e) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        bedrooms: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="relative">
                  <Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    className="pl-10"
                    placeholder="Bathrooms"
                    value={propertyData.bathrooms}
                    onChange={(e) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        bathrooms: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="relative">
                  <Move className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    className="pl-10"
                    placeholder="Square Footage"
                    value={propertyData.squareFootage}
                    onChange={(e) =>
                      setPropertyData((prev) => ({
                        ...prev,
                        squareFootage: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Textarea
                placeholder="Property Description"
                value={propertyData.description}
                onChange={(e) =>
                  setPropertyData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="h-32"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Property Images
                </label>
                <FileUpload
                  onUpload={(urls) =>
                    setUploadedImages((prev) => [...prev, ...urls])
                  }
                  accept="image/*"
                  landingPageId={`temp-${Date.now()}`}
                  maxFiles={5}
                />
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Uploaded Images ({uploadedImages.length}/5)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index}>
                        <ImagePreview
                          url={url}
                          onRemove={() => {
                            setUploadedImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!propertyData.title.trim() && step === 1}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || uploadedImages.length === 0}
                >
                  {isLoading ? 'Creating...' : 'Create Page'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
