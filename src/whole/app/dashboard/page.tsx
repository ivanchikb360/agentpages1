'use client';
import React, { useState, useEffect } from 'react';
import { CreatePageModal } from '../../components/CreatePageModal';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Plus,
  LinkIcon,
  QrCode,
  ExternalLink,
  Edit,
  MoreHorizontal,
  Loader2,
  Globe,
  Copy,
  Eye,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../../../components/ui/card';
import { ImageIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';
import { v4 as uuidv4 } from 'uuid';
import { generatePropertyContent } from '../../../services/ai-property';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  published_url?: string;
  thumbnail_url?: string;
  views: number;
  property_data: {
    images: string[];
    title: string;
    address: string;
    price?: string;
    bedrooms?: string;
    bathrooms?: string;
    squareFootage?: string;
    description?: string;
    features?: string[];
    agent?: {
      name: string;
      phone: string;
      email: string;
      photo?: string;
    };
  };
  content?: any[];
  subdomain?: string;
}

export default function AllPages() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPages();
    }
  }, [user]);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return supabase.storage.from('pages').getPublicUrl(imagePath).data
      .publicUrl;
  };

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const userId = user?.id;
      console.log('Current user ID:', userId);

      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const pagesWithImages = data?.map((page) => ({
        ...page,
        property_data: {
          ...page.property_data,
          images:
            page.property_data?.images?.map(getImageUrl).filter(Boolean) || [],
        },
      }));

      console.log('Fetched pages:', pagesWithImages);
      console.log(
        'First page images:',
        pagesWithImages?.[0]?.property_data?.images
      );
      setPages(pagesWithImages || []);
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      toast.error(error.message || 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = async (pageId: string) => {
    try {
      setIsLoading(true);

      // First delete all images associated with this landing page
      const { data: storageData, error: storageError } = await supabase.storage
        .from('pages')
        .list(`landing-pages/${pageId}/images`);

      if (!storageError && storageData) {
        await Promise.all(
          storageData.map((file) =>
            supabase.storage
              .from('pages')
              .remove([`landing-pages/${pageId}/images/${file.name}`])
          )
        );
      }

      // Then delete the landing page record
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      toast.success('Page deleted successfully');
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('Failed to delete page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Landing Pages</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Page
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="overflow-hidden">
              <div className="aspect-video relative">
                {page.property_data?.images?.[0] ? (
                  <img
                    src={getImageUrl(page.property_data.images[0])}
                    alt={page.property_data.title || 'Property Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      // Fallback to placeholder on error
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={
                      page.status === 'published' ? 'default' : 'secondary'
                    }
                  >
                    {page.status}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {page.property_data.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  {page.property_data.address}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${page.content?.length ? 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {page.content?.length ? 'Content Ready' : 'No Content'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <Link to={`/dashboard/page-builder/${page.id}`}>
                    <Button variant="outline" size="sm">
                      Edit Page
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the page and all its content.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(page.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Page
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreatePageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePage={async (propertyData) => {
          try {
            // First create the landing page record
            const { data: page, error } = await supabase
              .from('landing_pages')
              .insert({
                user_id: user?.id,
                status: 'draft',
                property_data: {
                  title: propertyData.title,
                  price: propertyData.price,
                  bedrooms: propertyData.bedrooms,
                  bathrooms: propertyData.bathrooms,
                  squareFootage: propertyData.squareFootage,
                  address: propertyData.address,
                  description: propertyData.description,
                  features: propertyData.features,
                  images: propertyData.images,
                  agent: propertyData.agent,
                },
                content: [], // Will be populated after AI generation
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (error) throw error;

            // Generate AI content based on property data
            const aiContent = await generatePropertyContent({
              title: propertyData.title,
              price: propertyData.price,
              bedrooms: propertyData.bedrooms,
              bathrooms: propertyData.bathrooms,
              squareFootage: propertyData.squareFootage,
              address: propertyData.address,
              description: propertyData.description,
              features: propertyData.features,
              images: propertyData.images,
            });

            // Update the page with AI-generated content
            const { error: updateError } = await supabase
              .from('landing_pages')
              .update({
                content: [
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
                      images: propertyData.images,
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
                    type: 'contact',
                    content: {
                      agent: propertyData.agent,
                    },
                    required: true,
                  },
                ],
              })
              .eq('id', page.id);

            if (updateError) throw updateError;

            // Navigate to the page builder
            navigate(`/dashboard/page-builder/${page.id}`);
            setIsModalOpen(false);
            toast.success('Landing page created successfully!');
          } catch (error) {
            console.error('Error creating page:', error);
            toast.error('Failed to create page');
          }
        }}
      />
    </div>
  );
}
