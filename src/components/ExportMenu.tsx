import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useStore } from '../store/useStore';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';
import toast from 'react-hot-toast';

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { sessions } = useStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type: 'pdf' | 'csv') => {
    if (!sessions.length) {
      toast.error('Geen gegevens beschikbaar om te exporteren');
      return;
    }

    try {
      if (type === 'pdf') {
        exportToPDF(sessions, 'Gebruiker');
        toast.success('PDF geëxporteerd');
      } else {
        exportToCSV(sessions);
        toast.success('CSV geëxporteerd');
      }
    } catch (error) {
      toast.error('Er is een fout opgetreden bij het exporteren');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-primary-100 p-2 text-accent-700 hover:bg-primary-200"
        title="Exporteer Gegevens"
      >
        <Download className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => handleExport('pdf')}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileText className="mr-3 h-4 w-4" />
            Exporteer als PDF
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FileSpreadsheet className="mr-3 h-4 w-4" />
            Exporteer als CSV
          </button>
        </div>
      )}
    </div>
  );
}