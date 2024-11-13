import React, { useState } from 'react';
import { Clock, LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UserSettings } from './UserSettings';
import toast from 'react-hot-toast';

export function Header() {
  const { user, logout } = useStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-b from-white to-gray-50 shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <img 
              src="https://i.imgur.com/dBjUamv.png" 
              alt="ShiftShift Logo" 
              className="h-16 w-auto"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-brand-dark">ShiftShift</h1>
              <p className="text-sm text-brand-dark">Omdat jouw tijd telt</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-brand-dark" />
                <span className="text-sm text-brand-dark">{new Date().toLocaleTimeString('nl-NL')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className="btn-icon-confirm flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Profiel</span>
                </button>
                <button
                  onClick={logout}
                  className="btn-danger flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Uitloggen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}
    </header>
  );
}