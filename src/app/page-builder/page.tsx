'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import PageRenderer from '../components/PageRenderer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PageBuilder() {
  const [viewMode, setViewMode] = useState<'edit' | 'split'>('edit');
  const [pageId, setPageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageStructure, setPageStructure] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState({
    style: 'modern',
    purpose: 'property-listing',
    tone: 'professional',
    uniqueFeatures: {
      layout: true,
      animations: true,
      interactivity: true,
      customCursor: true,
      scrollEffects: true,
    },
    designPreferences: {
      colorScheme: 'modern',
      typography: 'creative',
      spacing: 'airy',
      animations: 'smooth',
    },
  });

  useEffect(() => {
    // Load the page if pageId is available
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data?.structure) {
        setPageStructure(data.structure);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const savePage = async () => {
    if (!pageStructure) return;

    setIsSaving(true);
    setError(null);
    try {
      const { error } = await supabase.from('pages').upsert({
        id: pageId || undefined,
        structure: pageStructure,
        requirements,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success('Page saved successfully');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePage = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const { data: property } = await supabase
        .from('properties')
        .select('*')
        .eq('id', pageId)
        .single();

      if (!property) {
        throw new Error('Property not found');
      }

      const response = await fetch('/api/generate-ai-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property, requirements }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      setPageStructure(result);
      toast.success('Page generated successfully');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <h1 className="text-xl font-semibold">AI Page Builder</h1>
        <div className="flex gap-4">
          <button
            onClick={generatePage}
            disabled={isGenerating}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate Unique Design
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="flex-1 flex">
        <div className="w-80 border-r p-4 bg-gray-50 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Design Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Style
                  </label>
                  <select
                    value={requirements.style}
                    onChange={(e) =>
                      setRequirements((prev) => ({
                        ...prev,
                        style: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="modern">Modern & Minimal</option>
                    <option value="bold">Bold & Creative</option>
                    <option value="elegant">Elegant & Sophisticated</option>
                    <option value="playful">Playful & Dynamic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Interactive Features
                  </label>
                  <div className="space-y-2">
                    {Object.entries(requirements.uniqueFeatures).map(
                      ([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setRequirements((prev) => ({
                                ...prev,
                                uniqueFeatures: {
                                  ...prev.uniqueFeatures,
                                  [key]: e.target.checked,
                                },
                              }))
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {pageStructure ? (
            <PageRenderer structure={pageStructure} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p>Generate a unique AI-powered design to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
