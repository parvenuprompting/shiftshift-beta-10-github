import React, { useState } from 'react';
import { BarChart3, Clock, Trash2, Calendar, Edit2, Euro, CheckSquare, Square } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format, differenceInHours, differenceInMinutes, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { TimeAdjustment } from './TimeAdjustment';
import { Session } from '../types';

export function TimeReports() {
  const { sessions, deleteSession } = useStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const hourlyWage = Number(localStorage.getItem('userHourlyWage')) || 0;
  const showEarnings = localStorage.getItem('privacyShowEarnings') !== 'false';
  const netWagePercentage = 0.69;
  
  const weekStart = startOfWeek(new Date(), { locale: nl });
  const weekEnd = endOfWeek(new Date(), { locale: nl });
  const currentWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= weekStart && sessionDate <= weekEnd;
  });

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const currentMonthSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= monthStart && sessionDate <= monthEnd;
  });

  const calculateTotalTime = (sessionList: Session[]) => {
    const totalMinutes = sessionList.reduce((total, session) => {
      if (!session.endTime) return total;
      const duration = differenceInMinutes(new Date(session.endTime), new Date(session.startTime));
      return total + duration - (session.breakTime || 0);
    }, 0);

    const grossEarnings = (totalMinutes / 60) * hourlyWage;
    const netEarnings = grossEarnings * netWagePercentage;

    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      grossEarnings,
      netEarnings
    };
  };

  const weeklyTotal = calculateTotalTime(currentWeekSessions);
  const monthlyTotal = calculateTotalTime(currentMonthSessions);

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Weet u zeker dat u deze registratie wilt verwijderen?')) {
      try {
        await deleteSession(sessionId);
        setSelectedSessions(prev => prev.filter(id => id !== sessionId));
        toast.success('Registratie verwijderd');
      } catch (error) {
        console.error('Error deleting session:', error);
        toast.error('Kon registratie niet verwijderen');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedSessions.length) return;

    if (window.confirm(`Weet u zeker dat u ${selectedSessions.length} registratie(s) wilt verwijderen?`)) {
      setIsDeleting(true);
      try {
        for (const sessionId of selectedSessions) {
          await deleteSession(sessionId);
        }
        setSelectedSessions([]);
        toast.success('Geselecteerde registraties verwijderd');
      } catch (error) {
        console.error('Error deleting sessions:', error);
        toast.error('Kon niet alle registraties verwijderen');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const toggleAllSessions = () => {
    setSelectedSessions(prev => 
      prev.length === currentWeekSessions.length
        ? []
        : currentWeekSessions.map(s => s.id)
    );
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">Tijdoverzicht</h2>
          <BarChart3 className="h-6 w-6 text-brand-dark" />
        </div>
        {selectedSessions.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="btn-danger flex items-center space-x-2"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            <span>
              {isDeleting 
                ? 'Bezig met verwijderen...' 
                : `Verwijder (${selectedSessions.length})`}
            </span>
          </button>
        )}
      </div>

      <div className="mb-4 grid gap-4 sm:mb-6 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Deze Week</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-dark" />
              <span className="text-xl font-bold text-gray-900">
                {weeklyTotal.hours}u {weeklyTotal.minutes}m
              </span>
            </div>
            {showEarnings && hourlyWage > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-brand-dark" />
                  <span className="text-lg font-semibold text-gray-900">
                    € {weeklyTotal.netEarnings.toFixed(2)} (netto)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Deze Maand</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-dark" />
              <span className="text-xl font-bold text-gray-900">
                {monthlyTotal.hours}u {monthlyTotal.minutes}m
              </span>
            </div>
            {showEarnings && hourlyWage > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Euro className="h-5 w-5 text-brand-dark" />
                  <span className="text-lg font-semibold text-gray-900">
                    € {monthlyTotal.netEarnings.toFixed(2)} (netto)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Recente Registraties</h3>
          {currentWeekSessions.length > 0 && (
            <button
              onClick={toggleAllSessions}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {selectedSessions.length === currentWeekSessions.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>Selecteer alles</span>
            </button>
          )}
        </div>

        <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
          {currentWeekSessions.map(session => {
            const startTime = new Date(session.startTime);
            const endTime = session.endTime ? new Date(session.endTime) : null;
            const duration = endTime ? differenceInMinutes(endTime, startTime) - (session.breakTime || 0) : 0;
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            const netEarnings = (duration / 60) * hourlyWage * netWagePercentage;

            return (
              <div key={session.id} className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleSessionSelection(session.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600"
                    >
                      {selectedSessions.includes(session.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">
                        {format(startTime, 'EEEE d MMMM', { locale: nl })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(startTime, 'HH:mm', { locale: nl })} - 
                        {endTime ? format(endTime, ' HH:mm', { locale: nl }) : ' Actief'}
                      </div>
                      {endTime && (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{hours}u {minutes}m</span>
                            {session.breakTime > 0 && (
                              <span className="text-gray-500">
                                (incl. {Math.floor(session.breakTime / 60)}m pauze)
                              </span>
                            )}
                          </div>
                          {showEarnings && hourlyWage > 0 && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Euro className="h-4 w-4" />
                              <span>€ {netEarnings.toFixed(2)} (netto)</span>
                            </div>
                          )}
                        </div>
                      )}
                      {session.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Notities:</strong> {session.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2 sm:mt-0">
                    <button
                      onClick={() => setEditingSession(session)}
                      className="btn-icon-confirm"
                      title="Bewerk registratie"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="btn-icon-danger"
                      title="Verwijder registratie"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingSession && (
        <TimeAdjustment 
          session={editingSession} 
          onClose={() => setEditingSession(null)} 
        />
      )}
    </div>
  );
}