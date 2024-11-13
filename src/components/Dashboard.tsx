import React, { useState } from 'react';
import { Download, Settings, AlertTriangle, Clock, Navigation2 } from 'lucide-react';
import { NotesEditor } from './NotesEditor';
import { AdvancedFilters } from './AdvancedFilters';
import { useStore } from '../store/useStore';
import { BreakTimer } from './BreakTimer';
import { TimeReports } from './TimeReports';
import { WeeklyCalendar } from './WeeklyCalendar';
import { GDPRSettings } from './GDPRSettings';
import { WorkTimer } from './WorkTimer';
import { ExportMenu } from './ExportMenu';
import { TimeAdjustment } from './TimeAdjustment';
import { ExpenseTracker } from './expenses/ExpenseTracker';
import { DocumentManager } from './documents/DocumentManager';
import { HeroSlideshow } from './HeroSlideshow';
import { CommunityHub } from './community/CommunityHub';
import { NavigationScreen } from './navigation/NavigationScreen';
import toast from 'react-hot-toast';

export function Dashboard() {
  const [showGDPR, setShowGDPR] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeAdjustment, setShowTimeAdjustment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  
  const { currentSession, startSession, endSession } = useStore();

  const handleStartDay = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await startSession();
    } catch (error) {
      console.error('Error starting day:', error);
      toast.error('Kon dienst niet starten');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndDay = () => {
    setShowTimeAdjustment(true);
  };

  const handleOpenNotes = (date: Date) => {
    setSelectedDate(date);
    setShowNotes(true);
  };

  return (
    <div className="h-full overflow-auto px-2 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            {!currentSession ? (
              <button
                onClick={handleStartDay}
                className="btn-primary w-full disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Bezig met starten...' : 'Start Dienst'}
              </button>
            ) : (
              <button
                onClick={handleEndDay}
                className="btn-danger w-full"
              >
                Beëindig Dienst
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowNavigation(true)}
              className="btn-primary flex items-center space-x-2"
              title="Open Navigatie"
            >
              <Navigation2 className="h-5 w-5" />
              <span>Navigatie</span>
            </button>
            <ExportMenu />
            <button
              onClick={() => setShowGDPR(true)}
              className="btn-icon"
              title="Privacy Instellingen"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {currentSession && <WorkTimer />}

        <div className="space-y-4">
          <HeroSlideshow />
          <WeeklyCalendar onOpenNotes={handleOpenNotes} />
          <TimeReports />
          <ExpenseTracker />
          <DocumentManager />
          <CommunityHub />
        </div>

        {showTimeAdjustment && currentSession && (
          <TimeAdjustment 
            session={currentSession} 
            onClose={() => setShowTimeAdjustment(false)} 
            isEndOfDay={true}
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

        {showGDPR && <GDPRSettings onClose={() => setShowGDPR(false)} />}

        {showNavigation && (
          <NavigationScreen onClose={() => setShowNavigation(false)} />
        )}
      </div>
    </div>
  );
}