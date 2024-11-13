import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapIcon, Navigation, Layers, Truck } from 'lucide-react';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(5.2913);  // Netherlands center longitude
  const [lat, setLat] = useState(52.1326); // Netherlands center latitude
  const [zoom, setZoom] = useState(7);
  const [style, setStyle] = useState('streets-v12');

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${style}`,
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));

      map.current.on('move', () => {
        if (map.current) {
          setLng(Number(map.current.getCenter().lng.toFixed(4)));
          setLat(Number(map.current.getCenter().lat.toFixed(4)));
          setZoom(Number(map.current.getZoom().toFixed(2)));
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [style]);

  const changeMapStyle = (newStyle: string) => {
    setStyle(newStyle);
    if (map.current) {
      map.current.setStyle(`mapbox://styles/mapbox/${newStyle}`);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Navigatie</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => changeMapStyle('streets-v12')}
            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
            title="Stratenkaart"
          >
            <Navigation className="h-5 w-5" />
          </button>
          <button
            onClick={() => changeMapStyle('satellite-streets-v12')}
            className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
            title="Satelliet"
          >
            <Layers className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 z-10 m-2 rounded-md bg-white/90 px-2 py-1 text-sm">
          <div className="flex items-center space-x-1">
            <Truck className="h-4 w-4 text-blue-600" />
            <span>
              {lng}°E, {lat}°N
            </span>
          </div>
        </div>
        <div
          ref={mapContainer}
          className="h-[500px] w-full rounded-lg"
        />
      </div>
    </div>
  );
}