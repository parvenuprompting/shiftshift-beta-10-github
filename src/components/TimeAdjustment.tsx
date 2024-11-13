import React, { useState } from 'react';
import { Clock, Save, X, PenLine } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface TimeAdjustmentProps {
  session: any;
  onClose: () => void;
  isEndOfDay?: boolean;
}

export function TimeAdjustment({ session, onClose, isEndOfDay = false }: TimeAdjustmentProps) {
  const { adjustTime, endSession, updateSessionNotes } = useStore();
  const [startTime, setStartTime] = useState(
    format(new Date(session.startTime), "yyyy-MM-dd'T'HH:mm")
  );
  const [endTime, setEndTime] = useState(
    session.endTime 
      ? format(new Date(session.endTime), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [notes, setNotes] = useState(session.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateTimes = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError('Eindtijd moet later zijn dan starttijd');
      return false;
    }

    setError(null);
    return true;
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    setError(null);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateTimes()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (isEndOfDay) {
        await endSession();
        await adjustTime(session.id, startTime, endTime);
        if (notes !== session.notes) {
          await updateSessionNotes(session.id, notes);
        }
        toast.success('Werkdag beëindigd');
      } else {
        await adjustTime(session.id, startTime, endTime || undefined);
        if (notes !== session.notes) {
          await updateSessionNotes(session.id, notes);
        }
        toast.success('Tijd en notities aangepast');
      }
      onClose();
    } catch (error) {
      console.error('Error adjusting time:', error);
      toast.error('Er is een fout opgetreden bij het aanpassen');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isEndOfDay ? 'Beëindig Werkdag' : 'Tijd & Notities Aanpassen'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Tijd
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Eind Tijd
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required={isEndOfDay}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notities
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              rows={4}
              disabled={isSubmitting}
              placeholder="Voeg notities toe..."
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting || !!error}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Bezig...' : 'Opslaan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}