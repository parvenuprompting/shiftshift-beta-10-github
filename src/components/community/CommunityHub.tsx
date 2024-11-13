import React, { useState } from 'react';
import { Users, MessageSquare, Image as ImageIcon, Bell, AlertCircle, Hash } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { MessageCenter } from './MessageCenter';
import { MediaGallery } from './MediaGallery';
import { MainFeed } from './MainFeed';
import { GroupsPanel } from './GroupsPanel';
import { NotificationPanel } from './NotificationPanel';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'messages' | 'media' | 'profile'>('feed');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useStore();
  const communityEnabled = localStorage.getItem('communityEnabled') !== 'false';

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Log in om de community te bekijken</p>
      </div>
    );
  }

  if (!communityEnabled) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <AlertCircle className="h-12 w-12 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Community Functies Uitgeschakeld</h3>
          <p className="max-w-md text-gray-600">
            De community functies zijn momenteel uitgeschakeld. U kunt deze inschakelen via uw profiel instellingen als u gebruik wilt maken van de sociale functies.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Community</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('feed')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'feed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'groups'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4" />
              <span>Groepen</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Berichten</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-4 w-4" />
              <span>Media</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Profiel
          </button>
        </nav>
      </div>

      <div className="relative">
        {activeTab === 'feed' && <MainFeed />}
        {activeTab === 'groups' && <GroupsPanel />}
        {activeTab === 'messages' && <MessageCenter />}
        {activeTab === 'media' && <MediaGallery />}
        {activeTab === 'profile' && <UserProfile />}

        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
}