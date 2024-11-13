import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export function ActivityFeed() {
  const [newPost, setNewPost] = useState('');
  const { user } = useStore();

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error('Voer een bericht in');
      return;
    }

    // TODO: Implement post creation
    toast.success('Bericht geplaatst');
    setNewPost('');
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Deel iets met de community..."
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200">
              <ImageIcon className="h-5 w-5" />
              <span>Foto toevoegen</span>
            </button>
            <button
              onClick={handlePost}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Plaatsen
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {/* Sample posts */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-medium">Gebruiker {i}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(), 'dd MMM yyyy HH:mm', { locale: nl })}
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-4 text-gray-800">
              Dit is een voorbeeldbericht voor de community feed...
            </p>

            {i % 2 === 0 && (
              <img
                src={`https://source.unsplash.com/random/800x400?truck=${i}`}
                alt="Post"
                className="mb-4 rounded-lg"
              />
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <Heart className="h-5 w-5" />
                <span>24 likes</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <MessageSquare className="h-5 w-5" />
                <span>12 reacties</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
                <span>Delen</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}