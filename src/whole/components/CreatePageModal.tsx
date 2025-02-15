import React, { useState, useEffect, useRef } from 'react';
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
import {
  Home,
  DollarSign,
  Bed,
  Bath,
  Move,
  MapPin,
  Plus,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '../../lib/utils';

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
}

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (data: PropertyData) => void;
}

interface GooglePlace {
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

type AutocompleteOptions = {
  types?: string[];
  componentRestrictions?: {
    country: string | string[];
  };
  fields?: string[];
};

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: AutocompleteOptions
          ) => any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}

// Function to get suggested features based on location
const getSuggestedFeatures = async (address: string) => {
  // This would typically be an API call to a geocoding service
  // For now, we'll return some default features based on common property types
  const defaultFeatures = [
    'Central Air Conditioning',
    'Hardwood Floors',
    'Stainless Steel Appliances',
    'Granite Countertops',
    'Walk-in Closets',
    'High Ceilings',
    'Natural Light',
    'Open Floor Plan',
    'Modern Kitchen',
    'Updated Bathrooms',
  ];

  // If the address contains certain keywords, add specific features
  const lowerAddress = address.toLowerCase();
  if (lowerAddress.includes('apartment') || lowerAddress.includes('condo')) {
    return [
      ...defaultFeatures,
      'Elevator Access',
      'Secure Building Entry',
      'Package Reception',
      'Fitness Center',
      'Rooftop Deck',
    ];
  } else if (lowerAddress.includes('house') || lowerAddress.includes('home')) {
    return [
      ...defaultFeatures,
      'Private Backyard',
      'Attached Garage',
      'Front Porch',
      'Garden Space',
      'Patio/Deck',
    ];
  }

  return defaultFeatures;
};

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
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);
  const [landingPageId] = useState(() => uuidv4());
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  // Effect to get suggested features when address changes
  useEffect(() => {
    const loadFeatures = async () => {
      if (propertyData.address) {
        setIsLoadingFeatures(true);
        try {
          const features = await getSuggestedFeatures(propertyData.address);
          setSuggestedFeatures(features);
          // Automatically add all suggested features to propertyData
          setPropertyData((prev) => ({
            ...prev,
            features: Array.from(new Set([...prev.features, ...features])),
          }));
        } catch (error) {
          console.error('Error loading features:', error);
        } finally {
          setIsLoadingFeatures(false);
        }
      }
    };

    loadFeatures();
  }, [propertyData.address]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPropertyData((prev) => ({
      ...prev,
      address: value,
    }));
    setAddressError(null);
  };

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('google-maps-script');
      if (!existingScript && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (addressInputRef.current && window.google?.maps?.places) {
            try {
              const autocomplete = new window.google.maps.places.Autocomplete(
                addressInputRef.current,
                {
                  types: ['address'],
                  componentRestrictions: { country: 'us' },
                  fields: [
                    'formatted_address',
                    'address_components',
                    'geometry',
                  ],
                }
              );

              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address) {
                  setPropertyData((prev) => ({
                    ...prev,
                    address: place.formatted_address,
                  }));
                  setAddressError(null);
                }
              });

              // Store the autocomplete instance for cleanup
              autocompleteRef.current = autocomplete;
            } catch (error) {
              console.error(
                'Error initializing Google Places Autocomplete:',
                error
              );
            }
          }
        };

        script.onerror = () => {
          console.error('Failed to load Google Maps script');
        };

        document.head.appendChild(script);
      }
    };

    if (isOpen) {
      loadGoogleMapsScript();
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
      }
      const script = document.getElementById('google-maps-script');
      if (script) {
        script.remove();
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add validation
    if (!propertyData.title.trim()) {
      toast.error('Property title is required');
      return;
    }

    if (propertyData.features.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
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
        title: propertyData.title.trim(),
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
    });
    setUploadedImages([]);
    setSuggestedFeatures([]);
    setCustomFeature('');
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addCustomFeature = () => {
    if (customFeature.trim()) {
      setPropertyData((prev) => ({
        ...prev,
        features: [...prev.features, customFeature.trim()],
      }));
      setCustomFeature('');
    }
  };

  const toggleFeature = (feature: string) => {
    setPropertyData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  // Function to check if current step is complete
  const isStepComplete = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          propertyData.title.trim() !== '' && propertyData.address.trim() !== ''
        );
      case 2:
        return (
          propertyData.bedrooms !== '' &&
          propertyData.bathrooms !== '' &&
          propertyData.squareFootage !== ''
        );
      case 3:
        return propertyData.features.length > 0;
      case 4:
        return uploadedImages.length > 0;
      default:
        return false;
    }
  };

  // Function to handle next step
  const handleNextStep = () => {
    if (!isStepComplete(step)) {
      switch (step) {
        case 1:
          toast.error('Please fill in the property title and address');
          break;
        case 2:
          toast.error('Please fill in all property details');
          break;
        case 3:
          toast.error('Please select at least one feature');
          break;
        case 4:
          toast.error('Please upload at least one image');
          break;
      }
      return;
    }
    setStep((s) => Math.min(4, s + 1));
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
            {[1, 2, 3, 4].map((stepNumber) => (
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
            {step === 3 && 'Features'}
            {step === 4 && 'Images & Final Steps'}
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
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium">
                  Property Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
                  <input
                    ref={addressInputRef}
                    id="address"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Enter property address"
                    value={propertyData.address}
                    onChange={handleAddressChange}
                    onFocus={() => setAddressError(null)}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10',
                      addressError &&
                        'border-red-500 focus-visible:ring-red-500'
                    )}
                  />
                  {isAddressLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
                {addressError && (
                  <p className="text-sm text-red-500">{addressError}</p>
                )}
                <p className="text-sm text-gray-500">
                  Start typing to see address suggestions
                </p>
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
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Property Features</h3>
                {isLoadingFeatures ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2">Loading suggested features...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {propertyData.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {feature}
                          <button
                            onClick={() => toggleFeature(feature)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Add custom feature"
                        value={customFeature}
                        onChange={(e) => setCustomFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomFeature();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addCustomFeature}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <FileUpload
                landingPageId={landingPageId}
                onUpload={(urls) => setUploadedImages(urls)}
                maxFiles={10}
              />
              {uploadedImages.length > 0 && (
                <ImagePreview
                  images={uploadedImages}
                  onRemove={(index: number) => {
                    const newImages = [...uploadedImages];
                    newImages.splice(index, 1);
                    setUploadedImages(newImages);
                  }}
                />
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!isStepComplete(step)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !isStepComplete(4)}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Page'
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
