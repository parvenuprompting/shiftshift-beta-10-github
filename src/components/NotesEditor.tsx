import React, { useState } from 'react';
import { PenLine, X, Trash2, Save, AlertCircle, Bell } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { PlannedNote } from '../types';

interface NotesEditorProps {
  date: Date;
  onClose: () => void;
  viewAll?: boolean;
}

export function NotesEditor({ date, onClose, viewAll = false }: NotesEditorProps) {
  const { 
    sessions, 
    updateSessionNotes, 
    currentSession, 
    plannedNotes, 
    addPlannedNote, 
    updatePlannedNote, 
    deletePlannedNote 
  } = useStore();
  
  const [newNote, setNewNote] = useState('');
  const [isReminder, setIsReminder] = useState(false);
  const [editingNote, setEditingNote] = useState<{ id: string; notes: string } | null>(null);

  // Only filter planned notes by date
  const filteredPlannedNotes = plannedNotes.filter(note => 
    viewAll ? true : new Date(note.date).toDateString() === date.toDateString()
  );

  // Sort sessions by date, most recent first
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  const handleSave = (sessionId: string, notes: string) => {
    updateSessionNotes(sessionId, notes);
    setEditingNote(null);
    toast.success('Notities opgeslagen');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Voer een notitie in');
      return;
    }

    addPlannedNote(date, newNote, isReminder);
    setNewNote('');
    setIsReminder(false);
  };

  const hasContent = filteredPlannedNotes.length > 0 || sortedSessions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenLine className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium">
              {viewAll ? 'Alle Notities' : `Notities voor ${format(date, 'EEEE d MMMM', { locale: nl })}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* New Note Input */}
        <div className="mb-4 space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Voeg een nieuwe notitie toe..."
            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isReminder}
                onChange={(e) => setIsReminder(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Bell className="h-4 w-4" />
              <span>Als herinnering instellen</span>
            </label>
            <button
              onClick={handleAddNote}
              className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              <span>Notitie Toevoegen</span>
            </button>
          </div>
        </div>

        {/* Combined Notes Display */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {hasContent ? (
            <>
              {/* Planned Notes */}
              {filteredPlannedNotes.map((note) => (
                <div key={note.id} className="rounded-lg border border-gray-200 bg-blue-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {note.isReminder && <Bell className="h-4 w-4 text-blue-600" />}
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                    <button
                      onClick={() => deletePlannedNote(note.id)}
                      className="rounded-full p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {format(new Date(note.timestamp), 'dd MMM yyyy HH:mm', { locale: nl })}
                  </div>
                </div>
              ))}

              {/* Session Notes */}
              {sortedSessions.map((session) => (
                <div key={session.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {format(new Date(session.startTime), 'EEEE d MMMM yyyy', { locale: nl })}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingNote({ id: session.id, notes: session.notes || '' })}
                            className="btn-icon-confirm"
                          >
                            <PenLine className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSave(session.id, '')}
                            className="btn-icon-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {editingNote?.id === session.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingNote.notes}
                            onChange={(e) => setEditingNote({ ...editingNote, notes: e.target.value })}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            rows={4}
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingNote(null)}
                              className="btn-secondary"
                            >
                              Annuleren
                            </button>
                            <button
                              onClick={() => handleSave(session.id, editingNote.notes)}
                              className="btn-primary"
                            >
                              Opslaan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm text-gray-700">
                          {session.notes || 'Geen notities'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center rounded-lg bg-gray-50 p-6">
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="h-5 w-5" />
                <span>Geen notities gevonden</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}