import React, { useState, useRef } from 'react';
import { Upload, Filter, Grid, List, Play } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  userId: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  timestamp: string;
  likes: number;
}

export function MediaGallery() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.type.startsWith('video/')) {
      // Check video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 30) {
          toast.error('Video mag maximaal 30 seconden zijn');
          return;
        }
        // TODO: Implement upload logic
        toast.success('Video wordt geüpload');
      };
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('image/')) {
      // TODO: Implement upload logic
      toast.success('Afbeelding wordt geüpload');
    } else {
      toast.error('Ongeldig bestandstype');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Media</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            className="hidden"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Alle Media</option>
            <option value="images">Alleen Afbeeldingen</option>
            <option value="videos">Alleen Videos</option>
          </select>

          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('grid')}
              className={`rounded-l-md border p-2 ${
                view === 'grid'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-r-md border-b border-r border-t p-2 ${
                view === 'list'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sample media items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={`https://source.unsplash.com/random/800x600?truck=${i}`}
                alt={`Media ${i}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-medium text-white">
                    Media Titel {i}
                  </h3>
                </div>
              </div>
              {i % 3 === 0 && (
                <div className="absolute left-2 top-2 rounded-full bg-black/50 p-2">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {/* Sample list items */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4 py-4">
              <div className="relative h-20 w-32 flex-shrink-0">
                <img
                  src={`https://source.unsplash.com/random/800x600?truck=${i}`}
                  alt={`Media ${i}`}
                  className="h-full w-full rounded-lg object-cover"
                />
                {i % 3 === 0 && (
                  <div className="absolute left-2 top-2 rounded-full bg-black/50 p-1">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">Media Titel {i}</h3>
                <p className="text-sm text-gray-500">
                  Geüpload door Gebruiker {i}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}