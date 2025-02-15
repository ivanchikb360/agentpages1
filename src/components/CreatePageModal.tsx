import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'react-hot-toast';

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: () => void;
}

export function CreatePageModal({
  isOpen,
  onClose,
  onCreatePage,
}: CreatePageModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    industry: '',
    target_audience: '',
    key_features: [''],
    unique_selling_points: [''],
    tone_of_voice: 'professional',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    field: 'key_features' | 'unique_selling_points'
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayItem = (field: 'key_features' | 'unique_selling_points') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty strings from arrays
      const cleanedFeatures = formData.key_features.filter(Boolean);
      const cleanedUSPs = formData.unique_selling_points.filter(Boolean);

      // Create the landing page
      const { data: pageData, error: pageError } = await supabase
        .from('landing_pages')
        .insert([
          {
            user_id: user?.id,
            title: formData.title,
            description: formData.description,
            industry: formData.industry,
            target_audience: formData.target_audience,
            key_features: cleanedFeatures,
            unique_selling_points: cleanedUSPs,
            tone_of_voice: formData.tone_of_voice,
            status: 'draft',
          },
        ])
        .select()
        .single();

      if (pageError) throw pageError;

      toast.success('Landing page created successfully!');
      onCreatePage();
      onClose();
      navigate(`/dashboard/page-builder/${pageData.id}`);
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create landing page');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Landing Page</DialogTitle>
            <DialogDescription>
              Fill in the details to create your landing page. This information
              will be used to generate optimized content.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Input
                id="target_audience"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Key Features</Label>
              {formData.key_features.map((feature, index) => (
                <Input
                  key={index}
                  value={feature}
                  onChange={(e) =>
                    handleArrayInputChange(
                      index,
                      e.target.value,
                      'key_features'
                    )
                  }
                  placeholder={`Feature ${index + 1}`}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('key_features')}
              >
                Add Feature
              </Button>
            </div>

            <div className="grid gap-2">
              <Label>Unique Selling Points</Label>
              {formData.unique_selling_points.map((usp, index) => (
                <Input
                  key={index}
                  value={usp}
                  onChange={(e) =>
                    handleArrayInputChange(
                      index,
                      e.target.value,
                      'unique_selling_points'
                    )
                  }
                  placeholder={`USP ${index + 1}`}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem('unique_selling_points')}
              >
                Add USP
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tone_of_voice">Tone of Voice</Label>
              <Select
                value={formData.tone_of_voice}
                onValueChange={(value) =>
                  setFormData({ ...formData, tone_of_voice: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
