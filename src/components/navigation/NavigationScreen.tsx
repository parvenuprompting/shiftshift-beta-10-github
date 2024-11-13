import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Navigation2, Layers, Truck, CornerUpLeft, Route, Settings, Compass, AlertCircle, Search, MapPin, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicGFydmVudXByb21wdGluZyIsImEiOiJjbHRwbmYyOXIwMXB5MmltbGVqZnB0Y2NnIn0.0Y7gpQeUMGMR-6Mz_hW2Aw';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface NavigationScreenProps {
  onClose: () => void;
}

interface RecentAddress {
  id: string;
  address: string;
  timestamp: string;
}

const RECENT_ADDRESSES: RecentAddress[] = [
  { id: '1', address: 'Amsterdamseweg 123, Amsterdam', timestamp: new Date().toISOString() },
  { id: '2', address: 'Rotterdamplain 45, Rotterdam', timestamp: new Date().toISOString() },
  { id: '3', address: 'Utrechtstraat 67, Utrecht', timestamp: new Date().toISOString() }
];

export function NavigationScreen({ onClose }: NavigationScreenProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(5.2913);
  const [lat, setLat] = useState(52.1326);
  const [zoom, setZoom] = useState(7);
  const [style, setStyle] = useState('streets-v12');
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showAddressSearch, setShowAddressSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = () => {
    // Mock search results - will be replaced with actual API call
    if (searchQuery.trim()) {
      setSearchResults([
        `${searchQuery} - Resultaat 1`,
        `${searchQuery} - Resultaat 2`,
        `${searchQuery} - Resultaat 3`,
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddressSelect = (address: string) => {
    setDestination(address);
    setShowAddressSearch(false);
    initializeMap();
  };

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setMapError(null);

      if (!mapboxgl.accessToken) {
        throw new Error('Mapbox token is required');
      }

      if (!mapboxgl.supported()) {
        throw new Error('Your browser does not support Mapbox GL');
      }

      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        setLocationError('Locatietoegang is vereist voor navigatie');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { longitude, latitude } = position.coords;
      setLng(longitude);
      setLat(latitude);
      setLocationError(null);

      if (!map.current && mapContainer.current) {
        try {
          const mapInstance = new mapboxgl.Map({
            container: mapContainer.current,
            style: `mapbox://styles/mapbox/${style}`,
            center: [longitude, latitude],
            zoom: 15,
            pitch: 45,
            attributionControl: false,
            failIfMajorPerformanceCaveat: true
          });

          map.current = mapInstance;

          await new Promise((resolve, reject) => {
            mapInstance.once('load', resolve);
            mapInstance.once('error', reject);
          });

          mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
          mapInstance.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
              },
              trackUserLocation: true,
              showUserHeading: true
            }),
            'top-right'
          );

          mapInstance.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

          mapInstance.on('error', (e) => {
            console.error('Map error:', e);
            setMapError('Er is een fout opgetreden bij het laden van de kaart');
          });

          setIsLoading(false);
        } catch (error) {
          console.error('Map initialization error:', error);
          throw new Error('Kon de kaart niet initialiseren');
        }
      }
    } catch (error) {
      console.error('Setup error:', error);
      setMapError(error instanceof Error ? error.message : 'Er is een onbekende fout opgetreden');
      setIsLoading(false);
    }
  };

  if (showAddressSearch) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold">Zoek Bestemming</h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch();
                }}
                placeholder="Voer een adres of bestemming in..."
                className="w-full rounded-lg border border-gray-300 pl-12 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Zoekresultaten</h3>
                <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddressSelect(result)}
                      className="flex w-full items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                    >
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="flex-1 text-left text-gray-700">{result}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Addresses */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Recent</h3>
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {RECENT_ADDRESSES.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleAddressSelect(address.address)}
                    className="flex w-full items-center space-x-3 px-4 py-3 hover:bg-gray-50"
                  >
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="flex-1 text-left text-gray-700">{address.address}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">Truck Navigatie</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setStyle(style === 'streets-v12' ? 'satellite-streets-v12' : 'streets-v12')}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            title="Wissel Kaartweergave"
          >
            <Layers className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            title="Navigatie Instellingen"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-90">
            <div className="text-center">
              <Compass className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-2 text-sm text-gray-600">Kaart laden...</p>
            </div>
          </div>
        )}

        {(locationError || mapError) && (
          <div className="absolute inset-x-0 top-0 z-20 m-4 rounded-lg bg-red-50 p-4">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{locationError || mapError}</p>
            </div>
          </div>
        )}

        <div className="absolute left-0 right-0 top-0 z-10 m-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddressSearch(true)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-gray-700 shadow-sm hover:bg-gray-50"
            >
              {destination || "Zoek een bestemming..."}
            </button>
            <button
              onClick={() => setIsNavigating(!isNavigating)}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-white ${
                isNavigating 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={!!locationError || !!mapError || !destination}
            >
              {isNavigating ? (
                <>
                  <CornerUpLeft className="h-5 w-5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Navigation2 className="h-5 w-5" />
                  <span>Start</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div ref={mapContainer} className="h-full w-full" />

        {isNavigating && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Route className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Volgende instructie</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {lng.toFixed(4)}°E, {lat.toFixed(4)}°N
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}