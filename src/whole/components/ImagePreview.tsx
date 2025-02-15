import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  images: string[];
  onRemove: (index: number) => void;
}

export function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    new Array(images.length).fill(true)
  );

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  return (
    <motion.div
      className="grid grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {images.map((url, index) => (
        <motion.div
          key={url}
          className="relative group aspect-square"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="relative w-full h-full rounded-md overflow-hidden">
            {loadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            )}
            <img
              src={url}
              alt={`Property preview ${index + 1}`}
              className="w-full h-full object-cover rounded-md transition-opacity duration-300"
              style={{ opacity: loadingStates[index] ? 0 : 1 }}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
