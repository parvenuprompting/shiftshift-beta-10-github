import React, { useState } from 'react';
import { Hash, Plus, Users, Search, Settings, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  image?: string;
}

export function GroupsPanel() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { user } = useStore();

  const handleCreateGroup = () => {
    // TODO: Implement group creation
    toast.success('Groep aangemaakt');
    setShowCreateGroup(false);
  };

  const handleJoinGroup = (groupId: string) => {
    // TODO: Implement group joining
    toast.success('Lid geworden van groep');
  };

  return (
    <div className="flex gap-6">
      {/* Groups List */}
      <div className="w-1/3 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Groepen</h3>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="flex items-center space-x-2 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            <span>Nieuwe Groep</span>
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek groepen..."
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setSelectedGroup({ id: String(i), name: `Groep ${i}`, description: 'Een voorbeeldgroep', memberCount: 42, isPrivate: false })}
              className={`flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50 ${
                selectedGroup?.id === String(i) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Hash className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Groep {i}</div>
                  <div className="text-sm text-gray-500">42 leden</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Group Details */}
      {selectedGroup ? (
        <div className="flex-1 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
              <p className="text-gray-600">{selectedGroup.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleJoinGroup(selectedGroup.id)}
                className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Users className="h-4 w-4" />
                <span>Word Lid</span>
              </button>
              <button className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-4 font-medium">Leden</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div>
                    <div className="font-medium">Gebruiker {i}</div>
                    <div className="text-sm text-gray-500">Lid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Feed */}
          <div className="space-y-4">
            <h3 className="font-medium">Recente Berichten</h3>
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div>
                    <div className="font-medium">Gebruiker {i}</div>
                    <div className="text-xs text-gray-500">2 uur geleden</div>
                  </div>
                </div>
                <p className="text-gray-600">Een voorbeeldbericht in deze groep...</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500">
          Selecteer een groep om te bekijken
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Nieuwe Groep</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Naam
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Beschrijving
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="private" className="rounded border-gray-300" />
                <label htmlFor="private" className="text-sm text-gray-700">
                  Privé groep
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                >
                  Aanmaken
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}