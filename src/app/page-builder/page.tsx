'use client';
import React from 'react';
import { useState } from 'react';

export default function PageBuilder() {
  const [viewMode, setViewMode] = useState<'edit' | 'split'>('edit');
  const [pageId, setPageId] = useState<string | null>(null); // You'll need to set this when page is created/loaded

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Page Builder</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'edit' ? 'split' : 'edit')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            {viewMode === 'edit' ? 'Show Preview' : 'Hide Preview'}
          </button>{' '}
          // Fixed missing closing tag for button
          <button
            onClick={() => console.log('Save clicked')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ${viewMode === 'split' ? 'grid grid-cols-2' : ''}`}
      >
        <div className="h-full overflow-auto">
          {/* Your existing builder UI */}
        </div>

        {viewMode === 'split' && pageId && (
          <div className="h-full border-l">
            <iframe
              src={`/preview/${pageId}`}
              className="w-full h-full"
              title="Page Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
