import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  accept?: string;
  landingPageId: string;
}

export function FileUpload({
  onUpload,
  maxFiles = 10,
  accept,
  landingPageId,
}: FileUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        // Create object URLs for previews
        const previewUrls = acceptedFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setPreviews((prev) => [...prev, ...previewUrls]);

        console.log('Uploading files:', acceptedFiles);
        const uploadPromises = acceptedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `landing-pages/${landingPageId}/images/${fileName}`;

          if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
          }

          console.log('Uploading to path:', filePath);
          const { data, error } = await supabase.storage
            .from('landing-pages')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) {
            console.error('Upload error:', error);
            throw error;
          }

          const { data: urlData } = supabase.storage
            .from('landing-pages')
            .getPublicUrl(filePath);

          if (!urlData.publicUrl) {
            throw new Error('Failed to get public URL');
          }

          console.log('Got public URL:', urlData.publicUrl);
          return urlData.publicUrl;
        });

        const urls = await Promise.all(uploadPromises);
        console.log('All uploads complete:', urls);
        onUpload(urls);
      } catch (error: any) {
        console.error('Error uploading files:', error);
        toast.error(error.message || 'Failed to upload images');
      }
    },
    [onUpload, landingPageId]
  );

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previews.forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  const dropzoneOptions = {
    onDrop,
    maxFiles,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: true,
    noClick: false,
    noKeyboard: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  } as DropzoneOptions;

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop files here, or click to select files</p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviews((prev) => prev.filter((p) => p !== preview));
                  URL.revokeObjectURL(preview);
                }}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
