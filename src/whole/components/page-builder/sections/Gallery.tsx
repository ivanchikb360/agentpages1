import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../ui/dialog';
import { supabase } from '../../../../lib/supabase';

interface GalleryProps {
  content: {
    images?: string[];
  };
}

export function Gallery({ content = { images: [] } }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const images = Array.isArray(content?.images) ? content.images : [];

  // Helper function to get public URL for image
  const getImageUrl = (path: string) => {
    if (path.startsWith('http')) return path; // Already a full URL

    const { data } = supabase.storage
      .from('pages') // Changed to your actual bucket name
      .getPublicUrl(path);

    return data?.publicUrl;
  };

  return (
    <>
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(getImageUrl(image))}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <img
            src={selectedImage || ''}
            alt="Property"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
