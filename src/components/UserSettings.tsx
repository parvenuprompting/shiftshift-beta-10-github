import React, { useState, useRef, useEffect } from 'react';
import { X, Euro, Save, Users, AlertCircle, Camera, Upload, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface UserSettingsProps {
  onClose: () => void;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function UserSettings({ onClose }: UserSettingsProps) {
  const { user, updateUser } = useStore();
  const [username, setUsername] = useState(user?.username || '');
  const [hourlyWage, setHourlyWage] = useState(
    localStorage.getItem('userHourlyWage') || ''
  );
  const [employer, setEmployer] = useState(localStorage.getItem('userEmployer') || '');
  const [communityEnabled, setCommunityEnabled] = useState(
    localStorage.getItem('communityEnabled') !== 'false'
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [wageError, setWageError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(
    localStorage.getItem('userProfilePicture')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      setUsernameError('Gebruikersnaam moet minimaal 3 karakters bevatten');
      return false;
    }
    if (value.length > 20) {
      setUsernameError('Gebruikersnaam mag maximaal 20 karakters bevatten');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError('Alleen letters, cijfers en underscores zijn toegestaan');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    validateUsername(value);
  };

  const handleWageChange = (value: string) => {
    const formattedValue = value.replace('.', ',');
    
    if (formattedValue === '') {
      setWageError('');
      setHourlyWage('');
    } else if (!/^\d*,?\d{0,2}$/.test(formattedValue)) {
      setWageError('Gebruik een komma voor decimalen (bijv. 12,50)');
    } else {
      setWageError('');
      setHourlyWage(formattedValue);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Alleen afbeeldingen zijn toegestaan (JPG, PNG, GIF)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Afbeelding is te groot (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfilePicture(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!username.trim()) {
      setUsernameError('Gebruikersnaam is verplicht');
      return;
    }

    if (!validateUsername(username)) {
      return;
    }

    if (wageError) {
      toast.error('Corrigeer eerst het uurloon formaat');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSave = () => {
    if (updateUser) {
      updateUser(username);
    }
    const wageForStorage = hourlyWage ? hourlyWage.replace(',', '.') : '';
    localStorage.setItem('userHourlyWage', wageForStorage);
    localStorage.setItem('userEmployer', employer);
    localStorage.setItem('communityEnabled', communityEnabled.toString());
    if (profilePicture) {
      localStorage.setItem('userProfilePicture', profilePicture);
    }
    
    toast.success('Profiel instellingen zijn opgeslagen');
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.imgur.com/dBjUamv.png" 
              alt="ShiftShift Logo" 
              className="h-8 w-auto"
            />
            <h2 className="text-lg font-semibold text-gray-800">Profiel</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="h-24 w-24 overflow-hidden rounded-full bg-gray-200 ring-4 ring-white"
                onClick={handleProfilePictureClick}
              >
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-4 text-gray-400" />
                )}
              </div>
              <button
                onClick={handleProfilePictureClick}
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700"
                title="Upload profielfoto"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gebruikersnaam *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                usernameError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Kies een gebruikersnaam"
              required
            />
            {usernameError && (
              <p className="mt-1 text-sm text-red-600">{usernameError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Deze naam wordt gebruikt in de community sectie
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Werkgever
            </label>
            <input
              type="text"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Naam werkgever"
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bruto Uurloon (€)
              </label>
              <div className="mt-1 flex items-center">
                <Euro className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={hourlyWage}
                  onChange={(e) => handleWageChange(e.target.value)}
                  className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                    wageError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Bijv. 12,50"
                  step="0.10"
                />
              </div>
              {wageError && (
                <p className="mt-1 text-sm text-red-600">{wageError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Dit is uw bruto uurloon voor salaris berekeningen
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">
                  Community Functies
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={communityEnabled}
                  onChange={(e) => setCommunityEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {communityEnabled 
                ? 'Community functies zijn ingeschakeld. U kunt berichten plaatsen, communiceren met andere gebruikers en media delen.'
                : 'Community functies zijn uitgeschakeld. U kunt geen gebruik maken van sociale functies.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Opslaan</span>
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Bevestig wijzigingen</h3>
              <p className="mb-6 text-gray-600">
                Weet u zeker dat u deze wijzigingen wilt opslaan?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={confirmSave}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Bevestigen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}