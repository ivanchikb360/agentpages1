import React, { useEffect, useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Calendar } from '../../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Share2,
  MapPin,
  Trash2,
  GripVertical as DragHandle,
} from 'lucide-react';
import { TestimonialSlider } from './TestimonialSlider';
import { ResponsiveNavbar } from './ResponsiveNavbar';
import { Section } from './sections';
import { toast } from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';
import { supabase } from '../../../lib/supabase';

const findElementById = (elements: any[], id: string): any | null => {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    if (element.children) {
      const found = findElementById(element.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const updateElementInContent = (
  content: any[],
  id: string,
  updateFn: (element: any) => any
): any[] => {
  return content.map((element) => {
    if (element.id === id) {
      return updateFn(element);
    }
    if (element.children) {
      return {
        ...element,
        children: updateElementInContent(element.children, id, updateFn),
      };
    }
    return element;
  });
};

const removeElementFromContent = (content: any[], id: string): any[] => {
  return content.filter((element) => {
    if (element.id === id) {
      return false;
    }
    if (element.children) {
      element.children = removeElementFromContent(element.children, id);
    }
    return true;
  });
};

const parseHeroContent = (content: any) => {
  return {
    imageSrc: content.image || '/placeholder.svg',
    title: content.title || 'Property Title',
    price: content.price || '',
  };
};

const parseFeatures = (content: any) => {
  if (Array.isArray(content)) {
    return content;
  }
  return content.features || [];
};

const parseCTAContent = (content: any) => {
  return content.buttonText || 'Call to Action';
};

const PROPERTY_OPTIONAL_SECTIONS = [
  'hero',
  'features',
  'gallery',
  'description',
  'contact',
  'amenities',
  'location',
  'neighborhood',
  'floorplan',
  'testimonials',
  'similar',
] as const;

interface CanvasProps {
  content: any[];
  setContent: (content: any[]) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  selectedElement: any;
  setSelectedElement: (element: any) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  propertyData: {
    title: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    squareFootage: string;
    address: string;
    description: string;
    features: string[];
    images: string[];
    agent?: {
      name: string;
      phone: string;
      email: string;
      photo?: string;
    };
  };
  className?: string;
}

interface DraggableSectionProps {
  section: any;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onSelect: (id: string, element: any) => void;
  isSelected: boolean;
  onDelete: (id: string) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
  moveSection,
  onSelect,
  isSelected,
  onDelete,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'section',
    item: { index, id: section.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'section',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      className={`relative border-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isSelected
          ? 'border-blue-500'
          : 'border-transparent hover:border-gray-200'
      }`}
      onClick={() => onSelect(section.id, section)}
    >
      <div
        ref={ref}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full px-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="h-4 w-4 text-gray-400">
          <DragHandle />
        </div>
      </div>
      <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section.id);
          }}
          className="p-1 bg-red-100 rounded hover:bg-red-200 transition-colors"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
      <Section
        type={section.type}
        content={section.content}
        isSelected={isSelected}
      />
    </div>
  );
};

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return supabase.storage.from('pages').getPublicUrl(imagePath).data.publicUrl;
};

export function Canvas({
  content,
  setContent,
  selectedElementId,
  setSelectedElementId,
  selectedElement,
  setSelectedElement,
  previewMode,
  propertyData,
  className = '',
}: CanvasProps) {
  console.log('Canvas content:', content); // Debug log

  // Initialize with empty content instead of required sections
  React.useEffect(() => {
    if (content.length === 0) {
      setContent([]);
    }
  }, []);

  const getDefaultContentForType = (
    type: string,
    data: typeof propertyData
  ) => {
    switch (type) {
      case 'hero':
        return {
          title: data.title,
          subtitle: `${data.bedrooms} Beds • ${data.bathrooms} Baths • ${data.squareFootage} sq ft`,
          image: data.images[0] || '/placeholder.jpg',
          price: data.price,
        };
      case 'features':
        return {
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          squareFootage: data.squareFootage,
        };
      case 'gallery':
        return {
          images: data.images,
        };
      case 'description':
        return {
          text: data.description,
          features: data.features,
        };
      case 'contact':
        return {
          agent: data.agent || {
            name: 'Contact Agent',
            phone: '(555) 123-4567',
            email: 'agent@example.com',
          },
        };
      default:
        return {};
    }
  };

  // Modify drop handling to only accept optional sections
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'section',
    canDrop: (item: { type: string }) => {
      return PROPERTY_OPTIONAL_SECTIONS.includes(item.type as any);
    },
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      const newSection = {
        id: uuidv4(),
        type: item.type,
        content: getDefaultContentForType(item.type, propertyData),
        required: false,
      };

      setContent([...content, newSection]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const handleSelect = (id: string, element: any) => {
    setSelectedElementId(id);
    setSelectedElement(element);
  };

  const getPreviewClass = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      default:
        return 'max-w-[1440px] mx-auto';
    }
  };

  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newContent = [...content];
    const [removed] = newContent.splice(dragIndex, 1);
    newContent.splice(hoverIndex, 0, removed);
    setContent(newContent);
  };

  // Modify delete to prevent removing required sections
  const handleDelete = (id: string) => {
    const section = content.find((s) => s.id === id);
    if (section?.required) {
      toast.error("Can't delete required sections");
      return;
    }
    setContent(content.filter((section) => section.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
      setSelectedElement(null);
    }
  };

  return (
    <div className={cn('bg-white shadow-inner overflow-y-auto', className)}>
      <div className={`min-h-full ${getPreviewClass()}`}>
        {content.length === 0 ? (
          <div className="h-[80vh] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mx-4">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Start with a blank canvas</p>
              <p className="text-sm">
                Generate a unique design with AI or drag sections from the menu
              </p>
            </div>
          </div>
        ) : (
          <div className="group">
            {content.map((section, index) => {
              console.log('Canvas rendering section:', section); // Debug log
              if (section.type === 'gallery' && propertyData?.images) {
                section = {
                  ...section,
                  content: {
                    ...section.content,
                    images: propertyData.images.map(getImageUrl),
                  },
                };
              }

              return (
                <DraggableSection
                  key={section.id}
                  section={section}
                  index={index}
                  moveSection={moveSection}
                  onSelect={(id, element) => handleSelect(id, element)}
                  isSelected={selectedElementId === section.id}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
