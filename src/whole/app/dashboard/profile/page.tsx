'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar';
import { useAuth } from '../../../../contexts/AuthContext';
import { supabase } from '../../../../lib/supabase';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmDialog } from '../../../../components/ui/confirm-dialog';

interface Profile {
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  company: string | null;
  position: string | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    avatar_url: null,
    bio: '',
    company: '',
    position: '',
    website: '',
    linkedin: '',
    twitter: '',
    facebook: '',
  });
  const [showRemoveAvatarDialog, setShowRemoveAvatarDialog] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Profile data:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async (
    section: 'personal' | 'professional' | 'social'
  ) => {
    if (!user) return;
    setIsLoading(true);

    try {
      let updateData = {};

      switch (section) {
        case 'personal':
          updateData = {
            full_name: profile.full_name,
            bio: profile.bio,
          };
          break;
        case 'professional':
          updateData = {
            company: profile.company,
            position: profile.position,
            website: profile.website,
          };
          break;
        case 'social':
          updateData = {
            linkedin: profile.linkedin,
            twitter: profile.twitter,
            facebook: profile.facebook,
          };
          break;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    const uploadAvatar = async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${uuidv4()}.${fileExt}`;

      // First, create the bucket if it doesn't exist
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type, // Explicitly set the content type
        });

      if (uploadError) throw uploadError;

      // Get the public URL using the newer method
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      return publicUrl;
    };

    try {
      const publicUrl = await uploadAvatar(file);
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (profile.avatar_url) {
        const filePath = profile.avatar_url.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${filePath}`]);
        }
      }

      setProfile({ ...profile, avatar_url: null });
      toast.success('Profile picture removed');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showRemoveAvatarDialog}
        onClose={() => setShowRemoveAvatarDialog(false)}
        onConfirm={() => {
          setShowRemoveAvatarDialog(false);
          handleRemoveAvatar();
        }}
        title="Remove Profile Picture"
        description="Are you sure you want to remove your profile picture? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
      />

      <div className="flex h-screen">
        {/* Sidebar */}
        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Top Bar with UserNav */}
          <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>

          {/* Profile Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        {profile.avatar_url ? (
                          <AvatarImage
                            src={profile.avatar_url}
                            alt="Profile picture"
                            className="object-cover"
                            onError={(e) => {
                              console.error('Image load error:', e);
                              e.currentTarget.src = '/placeholder-avatar.png';
                            }}
                          />
                        ) : (
                          <AvatarFallback>
                            {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById('avatar-upload')?.click()
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? 'Uploading...' : 'Change Picture'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => setShowRemoveAvatarDialog(true)}
                      >
                        Remove Picture
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.full_name}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSave('personal')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Add your professional details to enhance your profile.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Enter your company name"
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Enter your job title"
                      value={profile.position}
                      onChange={(e) =>
                        setProfile({ ...profile, position: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.example.com"
                      value={profile.website}
                      onChange={(e) =>
                        setProfile({ ...profile, website: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSave('professional')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update Professional Info'}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>
                    Connect your social media accounts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      placeholder="https://www.linkedin.com/in/yourusername"
                      value={profile.linkedin}
                      onChange={(e) =>
                        setProfile({ ...profile, linkedin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourusername"
                      value={profile.twitter}
                      onChange={(e) =>
                        setProfile({ ...profile, twitter: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      placeholder="https://www.facebook.com/yourusername"
                      value={profile.facebook}
                      onChange={(e) =>
                        setProfile({ ...profile, facebook: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSave('social')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connecting...' : 'Connect Accounts'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
