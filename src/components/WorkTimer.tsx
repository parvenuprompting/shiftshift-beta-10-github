import React, { useState, useEffect } from 'react';
import { Clock, EuroIcon, Coffee, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, differenceInSeconds } from 'date-fns';
import { nl } from 'date-fns/locale';
import { BreakTimer } from './BreakTimer';

export function WorkTimer() {
  const { currentSession } = useStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const hourlyWage = Number(localStorage.getItem('userHourlyWage')) || 0;
  const [showBreakTimer, setShowBreakTimer] = useState(false);

  useEffect(() => {
    if (!currentSession) return;

    const interval = setInterval(() => {
      const seconds = differenceInSeconds(new Date(), new Date(currentSession.startTime));
      setElapsedTime(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  if (!currentSession) return null;

  const totalMinutes = Math.floor(elapsedTime / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const effectiveMinutes = totalMinutes - Math.floor((currentSession.breakTime || 0) / 60);
  const earnings = (effectiveMinutes / 60) * hourlyWage;

  const totalBreakMinutes = Math.floor((currentSession.breakTime || 0) / 60);
  const breakHours = Math.floor(totalBreakMinutes / 60);
  const breakMinutes = totalBreakMinutes % 60;

  return (
    <div className="mb-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Work Time */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Gewerkte Tijd</div>
                <div className="text-xl font-bold">
                  {hours}u {minutes}m
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBreakTimer(!showBreakTimer)}
              className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
              title="Pauze beheer"
            >
              <Coffee className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Start tijd: {format(new Date(currentSession.startTime), 'HH:mm', { locale: nl })}
          </div>
        </div>

        {/* Break Time */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <Coffee className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Totale Pauze Tijd</div>
              <div className="text-xl font-bold">
                {breakHours}u {breakMinutes}m
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Effectieve werktijd: {Math.floor(effectiveMinutes / 60)}u {effectiveMinutes % 60}m
          </div>
        </div>

        {/* Status Section - Placeholder for future functionality */}
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-xl font-bold">Actief</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Beschikbaar voor toekomstige functionaliteit
          </div>
        </div>
      </div>

      {/* Break Timer */}
      {showBreakTimer && <BreakTimer />}
    </div>
  );
}