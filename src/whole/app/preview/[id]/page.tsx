'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../../lib/supabase';
import { Hero } from '../../../components/page-builder/sections/Hero';
import { Features } from '../../../components/page-builder/sections/Features';
import { Gallery } from '../../../components/page-builder/sections/Gallery';
import { Description } from '../../../components/page-builder/sections/Description';
import { Amenities } from '../../../components/page-builder/sections/Amenities';
import { Contact } from '../../../components/page-builder/sections/Contact';
import { toast } from 'react-hot-toast';

interface SectionProps {
  content: any;
  isPreview?: boolean;
}

const sectionComponents = {
  hero: Hero,
  features: Features,
  gallery: Gallery,
  description: Description,
  amenities: Amenities,
  contact: Contact,
};

export default function PreviewPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validatePreviewAccess = async () => {
    if (!token) return false;

    const { data, error } = await supabase
      .from('preview_tokens')
      .select('*')
      .eq('id', token)
      .eq('page_id', id)
      .single();

    if (error || !data) return false;

    // Check if token is expired
    return new Date(data.expires_at) > new Date();
  };

  useEffect(() => {
    const getImageUrl = (imagePath: string | null) => {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return supabase.storage.from('landing-pages').getPublicUrl(imagePath).data
        .publicUrl;
    };

    const loadPage = async () => {
      try {
        console.log('Loading preview for page:', id);
        const { data, error } = await supabase
          .from('landing_pages')
          .select('content, property_data')
          .eq('id', id)
          .single();

        console.log('Raw data from DB:', data);

        if (error) throw error;
        if (!data) throw new Error('Page not found');
        if (!data.content) throw new Error('No content found');

        // Transform image URLs in content
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

        // Transform property data images
        if (data.property_data?.images) {
          data.property_data.images = data.property_data.images
            .map(getImageUrl)
            .filter(Boolean);
        }

        setPageData({ ...data, content: data.content });
      } catch (error) {
        console.error('Error loading preview:', error);
        toast.error(error.message || 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!pageData?.content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Page not found or no content available</p>
      </div>
    );
  }

  console.log('Rendering sections:', pageData.content);

  return (
    <div className="min-h-screen">
      {pageData.content.map((section: any) => {
        const Component =
          sectionComponents[section.type as keyof typeof sectionComponents];

        console.log('Rendering section:', {
          type: section.type,
          hasComponent: !!Component,
          content: section.content,
        });

        if (!Component) return null;

        return (
          <div key={section.id}>
            <Component content={section.content} />
          </div>
        );
      })}
    </div>
  );
}
