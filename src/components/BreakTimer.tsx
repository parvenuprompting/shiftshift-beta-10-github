import React, { useState, useEffect } from 'react';
import { Coffee, Play, Square, Clock, Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export function BreakTimer() {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(0);
  const [manualAdjustment, setManualAdjustment] = useState(0);
  const { currentSession, addBreak, endBreak } = useStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnBreak) {
      interval = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  const handleBreakToggle = () => {
    if (isOnBreak) {
      endBreak();
      toast.success(`Pauze beëindigd: ${Math.floor(breakTime / 60)} minuten`, {
        duration: 3000,
        position: 'top-right',
      });
      setBreakTime(0);
    } else {
      addBreak();
      toast.success('Pauze gestart', {
        duration: 3000,
        position: 'top-right',
      });
    }
    setIsOnBreak(!isOnBreak);
  };

  const adjustBreakTime = (minutes: number) => {
    if (!isOnBreak) {
      const newAdjustment = manualAdjustment + minutes;
      if (newAdjustment >= 0) {
        setManualAdjustment(newAdjustment);
        setBreakTime((prev) => Math.max(0, prev + minutes * 60));
        toast.success(`Pauzetijd aangepast: ${minutes > 0 ? '+' : ''}${minutes} minuten`);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!currentSession) return null;

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Coffee className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-sm text-gray-600">Huidige Pauze</div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-lg font-semibold">{formatTime(breakTime)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBreakToggle}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 ${
              isOnBreak 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isOnBreak ? (
              <>
                <Square className="h-5 w-5" />
                <span>Beëindig Pauze</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Pauze</span>
              </>
            )}
          </button>
        </div>

        {!isOnBreak && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-gray-600">Pas pauzetijd aan:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => adjustBreakTime(-5)}
                className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                title="5 minuten aftrekken"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => adjustBreakTime(5)}
                className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                title="5 minuten toevoegen"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}