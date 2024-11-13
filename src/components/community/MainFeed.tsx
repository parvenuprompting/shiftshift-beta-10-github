import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, Image as ImageIcon, User, MoreHorizontal, Calendar, MapPin } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  location?: string;
  timestamp: string;
  userAvatar?: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  userAvatar?: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: '1',
    userId: '1',
    username: 'JanTrucker',
    content: 'Net een mooie rit door de Alpen gehad! 🏔️ #TruckerLife',
    image: 'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=800',
    likes: 24,
    comments: [
      {
        id: '1',
        userId: '2',
        username: 'PietTransport',
        content: 'Prachtige route! Welke pas heb je genomen?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userAvatar: 'https://i.pravatar.cc/150?u=piet'
      }
    ],
    location: 'Zwitserse Alpen',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userAvatar: 'https://i.pravatar.cc/150?u=jan'
  },
  {
    id: '2',
    userId: '2',
    username: 'KlaasDriver',
    content: 'Nieuwe truck dag! 🚛 Klaar voor vele kilometers.',
    image: 'https://images.unsplash.com/photo-1586191582056-b5d6147dcd1e?w=800',
    likes: 42,
    comments: [],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userAvatar: 'https://i.pravatar.cc/150?u=klaas'
  },
  {
    id: '3',
    userId: '3',
    username: 'MarieLogistics',
    content: 'Tips voor een goede rustplek langs de A2? #VraagAanCollega\'s',
    likes: 15,
    comments: [
      {
        id: '2',
        userId: '1',
        username: 'JanTrucker',
        content: 'De nieuwe parkeerplaats bij Breukelen is top!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userAvatar: 'https://i.pravatar.cc/150?u=jan'
      }
    ],
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    userAvatar: 'https://i.pravatar.cc/150?u=marie'
  }
];

export function MainFeed() {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const { user } = useStore();
  const [posts, setPosts] = useState(SAMPLE_POSTS);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Afbeelding mag maximaal 5MB zijn');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) {
      toast.error('Voeg tekst of een afbeelding toe');
      return;
    }

    const newPostObj: Post = {
      id: Date.now().toString(),
      userId: user?.id || '',
      username: user?.username || 'Anoniem',
      content: newPost,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      userAvatar: `https://i.pravatar.cc/150?u=${user?.username}`
    };

    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setSelectedImage(null);
    toast.success('Bericht geplaatst');
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    toast.success('Bericht geliked');
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim()) {
      toast.error('Voer een reactie in');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user?.id || '',
      username: user?.username || 'Anoniem',
      content: newComment,
      timestamp: new Date().toISOString(),
      userAvatar: `https://i.pravatar.cc/150?u=${user?.username}`
    };

    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setNewComment('');
    toast.success('Reactie geplaatst');
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              {user?.username ? (
                <img
                  src={`https://i.pravatar.cc/150?u=${user.username}`}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-full w-full p-2 text-gray-400" />
              )}
            </div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Deel iets met de community..."
              className="flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>
          {selectedImage && (
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="max-h-64 rounded-lg object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/75"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center space-x-2 rounded-md bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200">
              <ImageIcon className="h-5 w-5" />
              <span>Foto toevoegen</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
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
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                  {post.userAvatar ? (
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-2 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{post.username}</div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true, locale: nl })}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-4 whitespace-pre-wrap text-gray-800">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="mb-4 rounded-lg"
              />
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              >
                <Heart className="h-5 w-5" />
                <span>{post.likes} likes</span>
              </button>
              <button
                onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              >
                <MessageSquare className="h-5 w-5" />
                <span>{post.comments.length} reacties</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                <Share2 className="h-5 w-5" />
                <span>Delen</span>
              </button>
            </div>

            {showComments === post.id && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {/* Comments */}
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                        {comment.userAvatar ? (
                          <img
                            src={comment.userAvatar}
                            alt={comment.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-1.5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 rounded-lg bg-gray-50 p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: nl })}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                    {user?.username ? (
                      <img
                        src={`https://i.pravatar.cc/150?u=${user.username}`}
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-1.5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Schrijf een reactie..."
                      className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}