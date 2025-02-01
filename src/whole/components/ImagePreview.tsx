import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
}

export function ImagePreview({ url, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <img
        src={url}
        alt="Property preview"
        className="w-full h-20 object-cover rounded-md"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          onRemove();
        }}
        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove image"
      >
        <X className="h-4 w-4 text-white" />
      </button>
    </div>
  );
} 