import React from 'react';
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
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Phone, MapPin, Home, MessageCircle, FileText } from 'lucide-react';

interface ToolItemProps {
  type: string;
  icon: React.ReactNode;
  label: string;
}

const sections = [
  {
    name: 'Required Sections',
    tools: [
      { type: 'hero', label: 'Hero Section' },
      { type: 'features', label: 'Property Features' },
      { type: 'gallery', label: 'Image Gallery' },
      { type: 'description', label: 'Description' },
      { type: 'contact', label: 'Contact Form' },
    ],
  },
  {
    name: 'Optional Sections',
    tools: [
      { type: 'amenities', label: 'Amenities' },
      { type: 'location', label: 'Location Map' },
      { type: 'neighborhood', label: 'Neighborhood' },
      { type: 'floorplan', label: 'Floor Plan' },
      { type: 'testimonials', label: 'Testimonials' },
      { type: 'similar', label: 'Similar Properties' },
    ],
  },
];

const ToolItem = ({ type, icon, label }: ToolItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'section',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center space-x-2 p-2 rounded-md cursor-move hover:bg-accent ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
};

const getIconForTool = (type: string) => {
  switch (type) {
    case 'section':
      return <Layout size={24} />;
    case 'div':
      return <Square size={24} />;
    case 'column':
      return <Columns size={24} />;
    case 'list':
      return <List size={24} />;
    case 'listItem':
      return <ListOrdered size={24} />;
    case 'button':
      return <ButtonIcon size={24} />;
    case 'header':
      return <Heading size={24} />;
    case 'paragraph':
      return <Type size={24} />;
    case 'textLink':
      return <Link size={24} />;
    case 'image':
      return <Image size={24} />;
    case 'video':
      return <Video size={24} />;
    case 'form':
      return <Form size={24} />;
    case 'label':
      return <Tag size={24} />;
    case 'input':
      return <Input size={24} />;
    case 'dateInput':
      return <Input size={24} />;
    case 'textarea':
      return <TextArea size={24} />;
    case 'checkbox':
      return <CheckSquare size={24} />;
    case 'radio':
      return <Radio size={24} />;
    case 'select':
      return <SelectIcon size={24} />;
    case 'submitButton':
      return <Send size={24} />;
    case 'slider':
      return <Sliders size={24} />;
    case 'socialLinks':
      return <Share2 size={24} />;
    case 'map':
      return <Map size={24} />;
    case 'navbar':
      return <MenuIcon size={24} />;
    default:
      return <Square size={24} />;
  }
};

export function ToolMenu({ className }: { className?: string }) {
  const requiredSections = [
    { type: 'hero', label: 'Hero Section', icon: Layout },
    { type: 'features', label: 'Features', icon: ListChecks },
    { type: 'gallery', label: 'Gallery', icon: Image },
    { type: 'description', label: 'Description', icon: FileText },
    { type: 'contact', label: 'Contact', icon: Phone },
  ];

  const optionalSections = [
    { type: 'amenities', label: 'Amenities', icon: Check },
    { type: 'location', label: 'Location', icon: MapPin },
    { type: 'neighborhood', label: 'Neighborhood', icon: Home },
    { type: 'floorplan', label: 'Floor Plan', icon: Box },
    { type: 'testimonials', label: 'Testimonials', icon: MessageCircle },
    { type: 'similar', label: 'Similar Properties', icon: Copy },
  ];

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'section',
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div className={cn('w-64 border-r p-4 bg-white', className)}>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-gray-500">
            Required Sections
          </h3>
          <div className="space-y-2">
            {requiredSections.map((section) => (
              <div
                key={section.type}
                className="flex items-center p-2 rounded-md bg-gray-50 text-sm"
              >
                <section.icon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{section.label}</span>
                <Check className="h-4 w-4 ml-auto text-green-500" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-gray-500">
            Optional Sections
          </h3>
          <div className="space-y-2">
            {optionalSections.map((section) => (
              <div
                key={section.type}
                ref={drag}
                className="flex items-center p-2 rounded-md hover:bg-blue-50 cursor-move text-sm transition-colors"
              >
                <section.icon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{section.label}</span>
                <Plus className="h-4 w-4 ml-auto text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
