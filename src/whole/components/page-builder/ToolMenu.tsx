import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Layout,
  Square,
  Columns,
  List,
  ListOrdered,
  BoxIcon as ButtonIcon,
  Heading,
  Type,
  Link,
  Image,
  Video,
  FileInputIcon as Input,
  Tag,
  TextIcon as TextArea,
  CheckSquare,
  Radio,
  BoxSelectIcon as SelectIcon,
  Send,
  Sliders,
  Share2,
  Map,
  MenuIcon,
  ShapesIcon as Form,
  Check,
  Plus,
  ListChecks,
  Box,
  Copy,
  Phone,
  MapPin,
  Home,
  MessageCircle,
  Calculator,
  ChartBar,
  Clock,
  Camera,
  Star,
  PlayCircle,
  DollarSign,
  FileText as FileIcon,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ToolItemProps {
  type: string;
  label: string;
}

const sections = [
  {
    name: 'Content Sections',
    tools: [
      { type: 'hero', label: 'Hero Section' },
      { type: 'features', label: 'Property Features' },
      { type: 'gallery', label: 'Image Gallery' },
      { type: 'description', label: 'Description' },
      { type: 'contact', label: 'Contact Form' },
      { type: 'amenities', label: 'Amenities' },
      { type: 'location', label: 'Location Map' },
      { type: 'neighborhood', label: 'Neighborhood' },
      { type: 'floorplan', label: 'Floor Plan' },
      { type: 'testimonials', label: 'Testimonials' },
      { type: 'similar', label: 'Similar Properties' },
    ],
  },
  {
    name: 'Creative Elements',
    tools: [
      { type: 'showcase', label: 'Visual Showcase' },
      { type: 'stats', label: 'Property Stats' },
      { type: 'timeline', label: 'Property Timeline' },
      { type: 'panorama', label: 'Panoramic View' },
      { type: 'highlights', label: 'Key Highlights' },
      { type: 'video', label: 'Video Tour' },
      { type: 'comparison', label: 'Price Comparison' },
      { type: 'calculator', label: 'Mortgage Calculator' },
    ],
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'hero':
      return Layout;
    case 'features':
      return ListChecks;
    case 'gallery':
      return Image;
    case 'description':
      return FileIcon;
    case 'contact':
      return Phone;
    case 'amenities':
      return Check;
    case 'location':
      return MapPin;
    case 'neighborhood':
      return Home;
    case 'floorplan':
      return Box;
    case 'testimonials':
      return MessageCircle;
    case 'similar':
      return Copy;
    case 'showcase':
      return Image;
    case 'stats':
      return ChartBar;
    case 'timeline':
      return Clock;
    case 'panorama':
      return Camera;
    case 'highlights':
      return Star;
    case 'video':
      return PlayCircle;
    case 'comparison':
      return DollarSign;
    case 'calculator':
      return Calculator;
    default:
      return Layout;
  }
};

const ToolItem = ({ type, label }: ToolItemProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'section',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const Icon = getIconForType(type);

  return (
    <div
      className={cn(
        'flex items-center space-x-2 p-2 rounded-md cursor-move hover:bg-accent',
        isDragging && 'opacity-50'
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export function ToolMenu({ className }: { className?: string }) {
  return (
    <div className={cn('w-64 bg-background', className)}>
      <div className="p-4">
        <h2 className="font-semibold mb-4">Page Elements</h2>
        {sections.map((section) => (
          <div key={section.name} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.tools.map((tool) => (
                <ToolItem key={tool.type} type={tool.type} label={tool.label} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
