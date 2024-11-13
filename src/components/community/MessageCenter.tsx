import React, { useState } from 'react';
import { Search, Send, User, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export function MessageCenter() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useStore();

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // TODO: Implement message sending logic
    toast.success('Bericht verzonden');
    setNewMessage('');
  };

  return (
    <div className="flex h-[600px] gap-4">
      {/* Chat List */}
      <div className="w-1/3 rounded-lg border border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek gesprekken..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {/* Sample chat items */}
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setSelectedChat(String(i))}
              className={`w-full p-4 text-left hover:bg-gray-100 ${
                selectedChat === String(i) ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <User className="h-10 w-10 rounded-full bg-gray-200 p-2" />
                  <Circle className="absolute -right-1 -top-1 h-3 w-3 text-green-500" />
                </div>
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Gebruiker {i}</span>
                    <span className="text-xs text-gray-500">12:34</span>
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    Laatste bericht preview...
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-1 flex-col rounded-lg border border-gray-200">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 rounded-full bg-gray-200 p-1.5" />
                <div>
                  <h3 className="font-medium">Gebruiker {selectedChat}</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Sample messages */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                    <p>Hallo! Hoe gaat het?</p>
                    <span className="mt-1 block text-right text-xs text-blue-100">
                      12:30
                    </span>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="rounded-lg bg-gray-100 px-4 py-2">
                    <p>Hey! Goed hoor, met jou?</p>
                    <span className="mt-1 block text-xs text-gray-500">
                      12:31
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Typ een bericht..."
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Selecteer een gesprek om te beginnen
          </div>
        )}
      </div>
    </div>
  );
}