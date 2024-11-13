import React from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkSession } from '../types';

export function FullCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { sessions } = useStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add padding days at the start to align with the correct day of the week
  const startPadding = monthStart.getDay();
  const paddedDays = Array(startPadding).fill(null);

  const getSessionsForDay = (day: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return isSameDay(sessionDate, day);
    });
  };

  const calculateDayTotal = (sessions: WorkSession[]) => {
    return sessions.reduce((total, session) => {
      if (!session.endTime) return total;
      const duration = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60);
      return total + duration - (session.breakTime || 0);
    }, 0);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(currentDate, 'MMMM yyyy', { locale: nl })}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-600 hover:bg-blue-200"
          >
            Vandaag
          </button>
          <button
            onClick={previousMonth}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200">
        {/* Weekday headers */}
        {['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* Calendar grid */}
        {[...paddedDays, ...monthDays].map((day, index) => {
          if (!day) {
            return <div key={`padding-${index}`} className="bg-white p-2" />;
          }

          const daySessions = getSessionsForDay(day);
          const totalMinutes = calculateDayTotal(daySessions);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = Math.floor(totalMinutes % 60);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] bg-white p-2 ${
                !isSameMonth(day, currentDate)
                  ? 'text-gray-400'
                  : isToday(day)
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              <div className="mb-1 text-right text-sm">
                {format(day, 'd', { locale: nl })}
              </div>
              {daySessions.length > 0 && (
                <div className="mt-1 rounded-md bg-blue-50 p-1">
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      {hours}u {minutes}m
                    </span>
                  </div>
                  {daySessions.map((session) => (
                    <div
                      key={session.id}
                      className="mt-1 truncate text-xs text-gray-600"
                      title={session.notes || undefined}
                    >
                      {format(new Date(session.startTime), 'HH:mm', {
                        locale: nl,
                      })}
                      {session.endTime &&
                        ` - ${format(new Date(session.endTime), 'HH:mm', {
                          locale: nl,
                        })}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}