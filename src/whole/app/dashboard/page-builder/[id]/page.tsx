'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  X,
  Share2,
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
import { formatDistanceToNow } from 'date-fns';
import { debounce } from 'lodash';
import { PreviewRenderer } from '../../../../components/page-builder/PreviewRenderer';

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

// Add these constants at the top
const PREVIEW_SIZES = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-none',
} as const;

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<
    'mobile' | 'tablet' | 'desktop'
  >('desktop');

  // Add preview transition
  const previewTransition = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce(async (content: any[]) => {
      try {
        setIsSaving(true);
        const { error } = await supabase
          .from('landing_pages')
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) throw error;
        setLastSaved(new Date());
        console.log('Autosaved successfully');
      } catch (error) {
        console.error('Autosave failed:', error);
        toast.error('Failed to autosave');
      } finally {
        setIsSaving(false);
      }
    }, 2000), // 2 second delay
    [id]
  );

  // Trigger autosave when content changes
  useEffect(() => {
    if (canvasContent.length > 0) {
      debouncedSave(canvasContent);
    }
  }, [canvasContent, debouncedSave]);

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

  // Add this function
  const handleSharePreview = async () => {
    try {
      // Generate a preview token
      const { data: token, error: tokenError } = await supabase
        .from('preview_tokens')
        .insert({
          page_id: id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })
        .select()
        .single();

      if (tokenError) throw tokenError;

      // Create preview URL
      const previewUrl = `${window.location.origin}/preview/${id}?token=${token.id}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(previewUrl);
      toast.success('Preview link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing preview:', error);
      toast.error('Failed to create preview link');
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
      <div className="flex flex-col h-screen">
        <header className="border-b">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              {/* Autosave indicator */}
            </div>
            <div className="flex items-center gap-2">
              {isPreviewMode ? (
                <>
                  <Tabs
                    value={previewDevice}
                    onValueChange={(v: any) => setPreviewDevice(v)}
                  >
                    <TabsList>
                      <TabsTrigger value="mobile">
                        <Smartphone className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="tablet">
                        <Tablet className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="desktop">
                        <Monitor className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewMode(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Exit Preview
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewMode(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              )}
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
              {isPreviewMode && (
                <Button variant="outline" onClick={handleSharePreview}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Preview
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {isPreviewMode ? (
            <motion.div
              className="h-full bg-gray-100 overflow-y-auto"
              initial="exit"
              animate="enter"
              variants={previewTransition}
            >
              <div
                className={`mx-auto bg-white shadow-xl transition-all duration-300 ${PREVIEW_SIZES[previewDevice]}`}
              >
                <PreviewRenderer
                  content={canvasContent}
                  propertyData={pageData?.property_data}
                />
              </div>
            </motion.div>
          ) : (
            <div className="flex h-full">
              <ToolMenu className="h-full" />
              <Canvas
                previewMode={previewMode}
                content={canvasContent}
                setContent={setCanvasContent}
                selectedElementId={selectedElementId}
                setSelectedElementId={setSelectedElementId}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                className="flex-1"
                propertyData={pageData?.property_data}
              />
              <EditingMenu
                selectedElementId={selectedElementId}
                setSelectedElementId={setSelectedElementId}
                canvasContent={canvasContent}
                setCanvasContent={setCanvasContent}
                onEnhanceSection={handleEnhanceSection}
              />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
