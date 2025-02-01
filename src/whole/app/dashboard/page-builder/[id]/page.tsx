'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Canvas } from '../../../../components/page-builder/Canvas';
import { EditingMenu } from '../../../../components/page-builder/EditingMenu';
import { Button } from '../../../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import {
  Save,
  Eye,
  ArrowLeft,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHistory } from '../../../../hooks/useHistory';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'react-hot-toast';
import { aiBuilder } from '../../../../../services/ai-builder';
import { ToolMenu } from '../../../../components/page-builder/ToolMenu';
import {
  generatePropertyContent,
  generateSimilarProperties,
} from '../../../../../services/ai-property';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

interface LandingPageImage {
  id: string; // Unique ID for the image
  pageId: string; // ID of the landing page
  path: string; // Storage path
  url: string; // Public URL
  createdAt: string;
}

const getMissingRequiredSections = (content: any[]) => {
  const requiredTypes = [
    'hero',
    'features',
    'gallery',
    'description',
    'contact',
  ];
  const existingTypes = content.map((section) => section.type);
  return requiredTypes.filter((type) => !existingTypes.includes(type));
};

// Update the getImageUrl helper
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return supabase.storage.from('landing-pages').getPublicUrl(imagePath).data
    .publicUrl;
};

// Mock function to fetch initial page data
const fetchPageData = async (id: string) => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Mock function for AI-generated content
const generateAIContent = async (pageData: any) => {
  try {
    // Generate content structure
    const content = await aiBuilder.generateContent({
      industry: pageData.industry,
      target_audience: pageData.target_audience,
      tone_of_voice: pageData.tone_of_voice,
      key_features: pageData.key_features,
      unique_selling_points: pageData.unique_selling_points,
    });

    // Generate styles
    const styles = await aiBuilder.generateStyles({
      industry: pageData.industry,
      tone_of_voice: pageData.tone_of_voice,
    });

    // Generate layout
    const layout = await aiBuilder.generateLayout(
      content.sections.map((s: any) => s.type)
    );

    // Combine everything into a template
    return {
      content,
      styles,
      layout,
    };
  } catch (error) {
    console.error('Error generating AI content:', error);
    toast.error('Failed to generate AI content');
    return null;
  }
};

export default function PageBuilder() {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [canvasContent, setCanvasContent, undo, redo, canUndo, canRedo] =
    useHistory<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<
    'desktop' | 'tablet' | 'mobile'
  >('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadPageData = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Transform image URLs
        if (data.property_data?.images) {
          data.property_data.images = data.property_data.images
            .map(getImageUrl)
            .filter(Boolean);
        }

        // Transform content image URLs
        if (data.content) {
          data.content = data.content.map((section: any) => {
            if (section.type === 'gallery' && section.content?.images) {
              return {
                ...section,
                content: {
                  ...section.content,
                  images: section.content.images
                    .map(getImageUrl)
                    .filter(Boolean),
                },
              };
            }
            return section;
          });
        }

        setPageData(data);
        setCanvasContent(data.content || []);
        setIsInitializing(false);
      } catch (error) {
        console.error('Error loading page:', error);
        toast.error('Failed to load page data');
        setIsInitializing(false);
      }
    };

    loadPageData();
  }, [id]);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Get all gallery images
      const landingPageImages = canvasContent
        .filter((section) => section.type === 'gallery')
        .flatMap((section) => section.content.images)
        .filter((img) => typeof img === 'string');

      // Store images with proper metadata
      const imagePromises = landingPageImages.map(async (imageUrl) => {
        if (imageUrl.startsWith('data:')) {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const imageId = uuidv4();
          const fileName = `${imageId}.${blob.type.split('/')[1]}`;
          const filePath = `landing-pages/${id}/images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('pages')
            .upload(filePath, blob);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from('pages').getPublicUrl(filePath);

          // Store image metadata
          const { error: dbError } = await supabase
            .from('landing_page_images')
            .insert({
              id: imageId,
              page_id: id,
              path: filePath,
              url: publicUrl,
              created_at: new Date().toISOString(),
            });

          if (dbError) throw dbError;

          return { id: imageId, path: filePath, url: publicUrl };
        }
        return imageUrl;
      });

      const storedImages = await Promise.all(imagePromises);

      // Update content with image references
      const updatedContent = canvasContent.map((section) => {
        if (section.type === 'gallery') {
          return {
            ...section,
            content: {
              ...section.content,
              images: storedImages.map((img) =>
                typeof img === 'string' ? img : img.url
              ),
            },
          };
        }
        return section;
      });

      // Save the landing page with image references
      const { error } = await supabase
        .from('landing_pages')
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString(),
          status: 'draft',
          image_ids: storedImages.map((img) =>
            typeof img === 'string' ? img : img.id
          ),
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);

      // Check for required sections
      const missingRequiredSections = getMissingRequiredSections(canvasContent);
      if (missingRequiredSections.length > 0) {
        toast.error(
          `Missing required sections: ${missingRequiredSections.join(', ')}`
        );
        return;
      }

      const updatedContent = canvasContent.map((section) => {
        if (section.type === 'gallery') {
          return {
            ...section,
            content: {
              ...section.content,
              images: section.content.images.map((img) =>
                typeof img === 'string' ? img : img.path || img.url
              ),
            },
          };
        }
        return section;
      });

      const { error } = await supabase
        .from('landing_pages')
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString(),
          status: 'published',
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Page published successfully!');
      window.open(`/preview/${id}`, '_blank');
    } catch (error) {
      console.error('Error publishing page:', error);
      toast.error('Failed to publish page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!pageData?.property_data) return;

    setIsLoading(true);
    try {
      const aiContent = await generatePropertyContent(pageData.property_data);

      const newSections = [
        {
          id: uuidv4(),
          type: 'hero',
          content: aiContent.hero,
          required: true,
        },
        {
          id: uuidv4(),
          type: 'features',
          content: aiContent.features,
          required: true,
        },
        {
          id: uuidv4(),
          type: 'gallery',
          content: {
            images: pageData.property_data.images,
          },
          required: true,
        },
        {
          id: uuidv4(),
          type: 'description',
          content: aiContent.description,
          required: true,
        },
        {
          id: uuidv4(),
          type: 'amenities',
          content: {
            title: 'Property Amenities',
            amenities: aiContent.amenities || [],
          },
          required: false,
        },
        {
          id: uuidv4(),
          type: 'contact',
          content: {
            agent: pageData.property_data.agent || {
              name: 'Contact Agent',
              phone: '(555) 123-4567',
              email: 'agent@example.com',
            },
          },
          required: true,
        },
      ];

      setCanvasContent(newSections);
      toast.success('Landing page generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate landing page');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to enhance individual sections
  const handleEnhanceSection = async (sectionId: string) => {
    const section = canvasContent.find((s) => s.id === sectionId);
    if (!section || !pageData) return;

    setIsLoading(true);
    try {
      let enhancedContent;
      switch (section.type) {
        case 'similar':
          enhancedContent = await generateSimilarProperties(
            pageData.property_data
          );
          break;
        // Add other section-specific enhancements
      }

      const updatedContent = canvasContent.map((s) =>
        s.id === sectionId
          ? { ...s, content: { ...s.content, ...enhancedContent } }
          : s
      );
      setCanvasContent(updatedContent);
      toast.success('Section enhanced with AI!');
    } catch (error) {
      console.error('Error enhancing section:', error);
      toast.error('Failed to enhance section');
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-200 opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Loading content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Creating Your Landing Page
              </h2>
              <p className="text-gray-600">
                Our AI is crafting the perfect content for your property
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-blue-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Progress steps */}
            <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
              {[
                'Loading data',
                'Analyzing property',
                'Generating content',
                'Finalizing',
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress >= (index + 1) * 25 ? 1 : 0.5 }}
                  className="text-center"
                >
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) return <div>Loading...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b h-16">
          <Link
            to="/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <Tabs
              value={previewMode}
              onValueChange={(value: any) => setPreviewMode(value)}
            >
              <TabsList>
                <TabsTrigger value="mobile">
                  <Smartphone className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="tablet">
                  <Tablet className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="desktop">
                  <Monitor className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" onClick={() => setPreviewMode('desktop')}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button onClick={undo} disabled={!canUndo}>
              <Undo className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button onClick={redo} disabled={!canRedo}>
              <Redo className="mr-2 h-4 w-4" /> Redo
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button onClick={handlePublish}>Publish</Button>
            <Button onClick={handleGenerateAI} disabled={isLoading}>
              <Wand2 className="mr-2 h-4 w-4" />
              AI Generate
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <ToolMenu className="h-[calc(100vh-4rem)]" />
          <Canvas
            content={canvasContent}
            setContent={setCanvasContent}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            previewMode={previewMode}
            className="flex-1 h-[calc(100vh-4rem)]"
            propertyData={{
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
                photo: '',
              },
            }}
          />
          <EditingMenu
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            canvasContent={canvasContent}
            setCanvasContent={setCanvasContent}
            onEnhanceSection={handleEnhanceSection}
          />
        </div>
      </div>
    </DndProvider>
  );
}
