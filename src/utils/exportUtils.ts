import { jsPDF } from 'jspdf';
import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import { nl } from 'date-fns/locale';
import { WorkSession } from '../types';

export const exportToPDF = (sessions: WorkSession[], userName: string) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('ChauffeursUren Rapport', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Chauffeur: ${userName}`, 20, 30);
  doc.text(`Gegenereerd op: ${format(new Date(), 'dd-MM-yyyy HH:mm', { locale: nl })}`, 20, 40);
  
  // Sessions
  let yPos = 60;
  sessions.forEach((session) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    const date = format(new Date(session.startTime), 'dd-MM-yyyy', { locale: nl });
    const startTime = format(new Date(session.startTime), 'HH:mm', { locale: nl });
    const endTime = session.endTime 
      ? format(new Date(session.endTime), 'HH:mm', { locale: nl })
      : 'Actief';
      
    const duration = session.endTime
      ? `${differenceInHours(new Date(session.endTime), new Date(session.startTime))}u ${
          differenceInMinutes(new Date(session.endTime), new Date(session.startTime)) % 60
        }m`
      : '-';
    
    doc.text(`Datum: ${date}`, 20, yPos);
    doc.text(`Tijd: ${startTime} - ${endTime}`, 20, yPos + 7);
    doc.text(`Duur: ${duration}`, 20, yPos + 14);
    
    if (session.notes) {
      doc.text('Notities:', 20, yPos + 21);
      doc.setFontSize(10);
      doc.text(session.notes, 30, yPos + 28);
      doc.setFontSize(12);
      yPos += 35;
    } else {
      yPos += 21;
    }
  });
  
  doc.save('chauffeurs-uren-rapport.pdf');
};

export const exportToCSV = (sessions: WorkSession[]) => {
  const headers = ['Datum', 'Start Tijd', 'Eind Tijd', 'Duur', 'Notities'];
  const rows = sessions.map(session => {
    const date = format(new Date(session.startTime), 'dd-MM-yyyy', { locale: nl });
    const startTime = format(new Date(session.startTime), 'HH:mm', { locale: nl });
    const endTime = session.endTime 
      ? format(new Date(session.endTime), 'HH:mm', { locale: nl })
      : '';
    const duration = session.endTime
      ? `${differenceInHours(new Date(session.endTime), new Date(session.startTime))}:${
          String(differenceInMinutes(new Date(session.endTime), new Date(session.startTime)) % 60).padStart(2, '0')
        }`
      : '';
    
    return [date, startTime, endTime, duration, session.notes].join(',');
  });
  
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chauffeurs-uren-export.csv';
  link.click();
};