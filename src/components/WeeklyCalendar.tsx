import React, { useState } from 'react';
import { Calendar, Clock, CalendarDays, PenLine, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
  isSameDay,
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { FullCalendar } from './FullCalendar';
import { TimeAdjustment } from './TimeAdjustment';
import { Session } from '../types';
import { NotesEditor } from './NotesEditor';
import toast from 'react-hot-toast';

interface WeeklyCalendarProps {
  onOpenNotes: (date: Date) => void;
}

export function WeeklyCalendar({ onOpenNotes }: WeeklyCalendarProps) {
  const { sessions, deleteSession } = useStore();
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const today = new Date();
  const weekStart = startOfWeek(today, { locale: nl });
  const weekEnd = endOfWeek(today, { locale: nl });
  
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return isSameDay(sessionDate, day);
    });
  };

  const handleDeleteSession = async (session: Session, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Weet u zeker dat u deze registratie wilt verwijderen?')) {
      try {
        await deleteSession(session.id);
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Kon registratie niet verwijderen');
      }
    }
  };

  const handleOpenNotes = (date: Date) => {
    setSelectedDate(date);
    setShowNotes(true);
  };

  const truncateNotes = (notes: string, maxLength: number = 50) => {
    if (notes.length <= maxLength) return notes;
    return notes.substring(0, maxLength) + '...';
  };

  if (showFullCalendar) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setShowFullCalendar(false)}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <Calendar className="h-4 w-4" />
            <span>Weekoverzicht</span>
          </button>
        </div>
        <FullCalendar />
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Weekoverzicht</h2>
        <div className="flex items-center justify-end space-x-4">
          <Calendar className="h-6 w-6 text-blue-600" />
          <button
            onClick={() => setShowFullCalendar(true)}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Volledige Agenda</span>
          </button>
        </div>
      </div>

      <div className="grid h-[200px] grid-cols-7 gap-1 overflow-hidden sm:gap-4">
        {weekDays.map((day) => {
          const daySessions = getSessionsForDay(day);
          const totalMinutes = daySessions.reduce((total, session) => {
            if (!session.endTime) return total;
            return (
              total +
              Math.floor(
                (new Date(session.endTime).getTime() -
                  new Date(session.startTime).getTime()) /
                  1000 /
                  60
              )
            );
          }, 0);

          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const hasNotes = daySessions.some(session => session.notes);
          const dayNotes = daySessions.find(session => session.notes)?.notes;

          return (
            <div
              key={day.toISOString()}
              className={`flex h-full flex-col justify-between overflow-hidden rounded-lg border p-1 sm:p-2 ${
                isSameDay(day, today)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 sm:text-sm">
                    {format(day, 'E', { locale: nl })}
                  </div>
                  <div className="mt-1 text-base font-semibold sm:text-lg">
                    {format(day, 'd', { locale: nl })}
                  </div>
                </div>
                {daySessions.length > 0 && (
                  <div className="mt-1 flex items-center justify-center text-xs text-gray-600 sm:text-sm">
                    <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {hours}u {minutes}m
                  </div>
                )}
                {dayNotes && (
                  <div className="mt-1 text-xs text-gray-600">
                    <p className="line-clamp-2 text-center italic">
                      {truncateNotes(dayNotes)}
                    </p>
                  </div>
                )}
                {daySessions.map((session) => (
                  <div 
                    key={session.id}
                    className="mt-1 text-xs text-gray-600"
                  >
                    <div className="flex items-center justify-between">
                      <span>
                        {format(new Date(session.startTime), 'HH:mm', { locale: nl })}
                        {session.endTime && ` - ${format(new Date(session.endTime), 'HH:mm', { locale: nl })}`}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingSession(session)}
                          className="rounded-full p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                          title="Bewerk registratie"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSession(session, e)}
                          className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                          title="Verwijder registratie"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleOpenNotes(day)}
                className={`mt-1 flex items-center justify-center rounded-full p-1 transition-all sm:p-1.5 ${
                  hasNotes 
                    ? 'bg-gray-200 text-gray-700 shadow-md hover:bg-gray-300' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
                title={hasNotes ? 'Bekijk notities' : 'Voeg notitie toe'}
              >
                <PenLine className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {editingSession && (
        <TimeAdjustment
          session={editingSession}
          onClose={() => setEditingSession(null)}
        />
      )}

      {showNotes && selectedDate && (
        <NotesEditor
          date={selectedDate}
          onClose={() => {
            setShowNotes(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}