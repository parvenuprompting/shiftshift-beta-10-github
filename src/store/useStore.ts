import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Session, User, Expense, Document, PlannedNote } from '../types';

interface State {
  user: User | null;
  currentSession: Session | null;
  sessions: Session[];
  expenses: Expense[];
  documents: Document[];
  plannedNotes: PlannedNote[];
  login: (username: string) => void;
  logout: () => void;
  updateUser: (username: string) => void;
  startSession: () => void;
  endSession: () => void;
  updateHourlyRate: (rate: number) => void;
  addBreak: () => void;
  endBreak: () => void;
  adjustBreakTime: (minutes: number) => void;
  addNote: (note: string) => void;
  updateSessionNotes: (sessionId: string, notes: string) => void;
  addPlannedNote: (date: Date, content: string, isReminder?: boolean) => void;
  updatePlannedNote: (noteId: string, content: string) => void;
  deletePlannedNote: (noteId: string) => void;
  addTask: (task: string) => void;
  toggleTask: (taskId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  adjustTime: (sessionId: string, startTime: string, endTime?: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'timestamp'>) => void;
  updateExpense: (expenseId: string, data: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  clearAllExpenses: () => void;
  uploadDocument: (file: File, type: Document['type'], title: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      currentSession: null,
      sessions: [],
      expenses: [],
      documents: [],
      plannedNotes: [],
      
      login: (username) => {
        set({ 
          user: { 
            id: Date.now().toString(), 
            username 
          } 
        });
      },
      
      updateUser: (username) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, username } });
        }
      },
      
      logout: () => {
        set({ user: null, currentSession: null });
      },
      
      startSession: () => {
        const newSession: Session = {
          id: Date.now().toString(),
          userId: get().user?.id || '',
          startTime: new Date().toISOString(),
          breaks: [],
          notes: '',
          tasks: [],
          breakTime: 0
        };
        set({ currentSession: newSession });
        toast.success('Werkdag gestart');
      },
      
      endSession: () => {
        const { currentSession, sessions } = get();
        if (currentSession) {
          const endedSession = {
            ...currentSession,
            endTime: new Date().toISOString(),
          };
          set({
            currentSession: null,
            sessions: [...sessions, endedSession],
          });
        }
      },

      addPlannedNote: (date: Date, content: string, isReminder: boolean = false) => {
        const newNote: PlannedNote = {
          id: Date.now().toString(),
          userId: get().user?.id || '',
          date: date.toISOString(),
          content,
          timestamp: new Date().toISOString(),
          isReminder
        };
        set((state) => ({
          plannedNotes: [...state.plannedNotes, newNote]
        }));
        toast.success(isReminder ? 'Herinnering toegevoegd' : 'Notitie toegevoegd');
      },

      updatePlannedNote: (noteId: string, content: string) => {
        set((state) => ({
          plannedNotes: state.plannedNotes.map(note =>
            note.id === noteId
              ? { ...note, content }
              : note
          )
        }));
        toast.success('Notitie bijgewerkt');
      },

      deletePlannedNote: (noteId: string) => {
        set((state) => ({
          plannedNotes: state.plannedNotes.filter(note => note.id !== noteId)
        }));
        toast.success('Notitie verwijderd');
      },
      
      updateHourlyRate: (rate) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, hourlyRate: rate } });
        }
      },
      
      addBreak: () => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              breaks: [...currentSession.breaks, { start: new Date().toISOString() }],
            },
          });
        }
      },
      
      endBreak: () => {
        const { currentSession } = get();
        if (currentSession && currentSession.breaks.length > 0) {
          const lastBreak = currentSession.breaks[currentSession.breaks.length - 1];
          if (!lastBreak.end) {
            const endTime = new Date().toISOString();
            const breakDuration = Math.floor(
              (new Date(endTime).getTime() - new Date(lastBreak.start).getTime()) / 1000
            );
            const updatedBreaks = [...currentSession.breaks];
            updatedBreaks[updatedBreaks.length - 1] = {
              ...lastBreak,
              end: endTime,
            };
            set({
              currentSession: {
                ...currentSession,
                breaks: updatedBreaks,
                breakTime: (currentSession.breakTime || 0) + breakDuration,
              },
            });
          }
        }
      },

      adjustBreakTime: (minutes) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              breakTime: Math.max(0, (currentSession.breakTime || 0) + minutes * 60),
            },
          });
        }
      },
      
      addNote: (note) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              notes: note,
            },
          });
        }
      },

      updateSessionNotes: (sessionId, notes) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, notes }
              : session
          ),
          currentSession: state.currentSession?.id === sessionId
            ? { ...state.currentSession, notes }
            : state.currentSession
        }));
      },
      
      addTask: (task) => {
        const { currentSession } = get();
        if (currentSession) {
          set({
            currentSession: {
              ...currentSession,
              tasks: [
                ...currentSession.tasks,
                { id: Date.now().toString(), text: task, completed: false },
              ],
            },
          });
        }
      },
      
      toggleTask: (taskId) => {
        const { currentSession } = get();
        if (currentSession) {
          const updatedTasks = currentSession.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          );
          set({
            currentSession: {
              ...currentSession,
              tasks: updatedTasks,
            },
          });
        }
      },
      
      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== sessionId)
        }));
      },
      
      clearAllSessions: () => {
        set({ sessions: [] });
      },

      adjustTime: (sessionId, startTime, endTime) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, startTime, endTime }
              : session
          ),
        }));
      },

      addExpense: (expenseData) => {
        const expense: Expense = {
          id: Date.now().toString(),
          userId: get().user?.id || '',
          timestamp: new Date().toISOString(),
          ...expenseData,
        };
        set((state) => ({
          expenses: [...state.expenses, expense]
        }));
        toast.success('Uitgave toegevoegd');
      },

      updateExpense: (expenseId, data) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? { ...expense, ...data }
              : expense
          )
        }));
        toast.success('Uitgave bijgewerkt');
      },

      deleteExpense: (expenseId) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== expenseId)
        }));
      },

      clearAllExpenses: () => {
        set({ expenses: [] });
      },

      uploadDocument: async (file, type, title) => {
        const document: Document = {
          id: Date.now().toString(),
          userId: get().user?.id || '',
          type,
          title,
          fileUrl: URL.createObjectURL(file),
          timestamp: new Date().toISOString(),
          metadata: {
            size: file.size,
            mimeType: file.type,
            originalName: file.name,
          },
        };
        set((state) => ({
          documents: [...state.documents, document]
        }));
      },

      deleteDocument: async (documentId) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== documentId)
        }));
      },
    }),
    {
      name: 'shiftshift-storage',
    }
  )
);