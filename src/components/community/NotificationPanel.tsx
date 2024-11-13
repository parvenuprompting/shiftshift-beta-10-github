import React from 'react';
import { X, Bell, MessageSquare, Heart, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  return (
    <div className="absolute right-0 top-0 z-50 w-96 rounded-lg border border-gray-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium">Meldingen</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="max-h-[400px] divide-y divide-gray-200 overflow-y-auto">
        {/* Sample notifications */}
        <div className="flex items-start space-x-3 p-4">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">Jan Jansen</span> heeft je een bericht
              gestuurd
            </p>
            <span className="text-xs text-gray-500">
              {format(new Date(), 'HH:mm', { locale: nl })}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4">
          <Heart className="h-5 w-5 text-red-500" />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">Piet Peters</span> vind je foto leuk
            </p>
            <span className="text-xs text-gray -500">
              {format(new Date(), 'HH:mm', { locale: nl })}
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4">
          <UserPlus className="h-5 w-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">Klaas Klaassen</span> volgt je nu
            </p>
            <span className="text-xs text-gray-500">
              {format(new Date(), 'HH:mm', { locale: nl })}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
          Alle meldingen bekijken
        </button>
      </div>
    </div>
  );
}