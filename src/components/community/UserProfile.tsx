import React, { useState } from 'react';
import { Camera, MapPin, Briefcase, Mail, Phone, Edit2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200',
  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200',
  'https://images.unsplash.com/photo-1506306157100-14d5a321c181?w=1200',
  'https://images.unsplash.com/photo-1498887960847-2a5e46312788?w=1200'
];

export function UserProfile() {
  const { user } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    company: '',
    email: '',
    phone: '',
    experience: '',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profiel bijgewerkt');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  return (
    <div className="space-y-6">
      {/* Hero Slider */}
      <div className="relative h-64 overflow-hidden rounded-lg">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Hero ${index + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          </div>
        ))}
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all hover:bg-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg transition-all hover:bg-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-white shadow-lg">
              <User className="h-full w-full p-4 text-gray-400" />
            </div>
            <button className="absolute bottom-1 right-1 rounded-full bg-blue-500 p-1.5 text-white hover:bg-blue-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
                <p className="text-sm text-gray-500">Lid sinds januari 2024</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <Edit2 className="h-4 w-4" />
                <span>{isEditing ? 'Annuleren' : 'Bewerk Profiel'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="mt-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Locatie
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bedrijf
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData({ ...profileData, company: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Opslaan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Amsterdam, Nederland</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="h-4 w-4" />
                <span>5 jaar ervaring</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>gebruiker@email.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+31 6 12345678</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}