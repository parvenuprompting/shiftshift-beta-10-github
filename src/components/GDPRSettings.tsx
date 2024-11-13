import React, { useState } from 'react';
import { Shield, X, Lock, Database, Download, Trash2, Bell, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';
import toast from 'react-hot-toast';

interface GDPRSettingsProps {
  onClose: () => void;
}

interface PrivacySettings {
  dataRetention: number;
  autoDeleteEnabled: boolean;
  notificationsEnabled: boolean;
  showEarnings: boolean;
  exportFormat: 'pdf' | 'csv';
}

export function GDPRSettings({ onClose }: GDPRSettingsProps) {
  const { deleteAllSessions } = useStore();
  const [consentGiven, setConsentGiven] = useState(
    localStorage.getItem('gdprConsent') === 'true'
  );
  
  const defaultSettings: PrivacySettings = {
    dataRetention: Number(localStorage.getItem('privacyDataRetention')) || 12,
    autoDeleteEnabled: localStorage.getItem('privacyAutoDelete') === 'true',
    notificationsEnabled: localStorage.getItem('privacyNotifications') === 'true',
    showEarnings: localStorage.getItem('privacyShowEarnings') !== 'false',
    exportFormat: (localStorage.getItem('privacyExportFormat') as 'pdf' | 'csv') || 'pdf'
  };

  const [settings, setSettings] = useState<PrivacySettings>(defaultSettings);

  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const consent = event.target.checked;
    setConsentGiven(consent);
    localStorage.setItem('gdprConsent', consent.toString());
    toast.success(
      consent ? 'GDPR-toestemming gegeven' : 'GDPR-toestemming ingetrokken'
    );
  };

  const handleSettingChange = (key: keyof PrivacySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`privacy${key.charAt(0).toUpperCase() + key.slice(1)}`, value.toString());
    toast.success('Instelling bijgewerkt');
  };

  const handleDeleteAllData = () => {
    if (
      window.confirm(
        'Weet u zeker dat u alle gegevens permanent wilt verwijderen? Dit kan niet ongedaan worden gemaakt.'
      )
    ) {
      deleteAllSessions();
      localStorage.clear();
      setConsentGiven(false);
      setSettings(defaultSettings);
      toast.success('Alle gegevens zijn verwijderd');
      onClose();
    }
  };

  const handleExportData = () => {
    try {
      if (settings.exportFormat === 'pdf') {
        exportToPDF([], 'Privacy Export');
      } else {
        exportToCSV([]);
      }
      toast.success(`Gegevens geëxporteerd als ${settings.exportFormat.toUpperCase()}`);
    } catch (error) {
      toast.error('Fout bij het exporteren van gegevens');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-brand-dark" />
            <h2 className="text-lg font-semibold text-brand-dark">Privacy Instellingen</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* GDPR Consent */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Lock className="mt-1 h-5 w-5 text-brand-dark" />
              <div className="flex-1">
                <h3 className="mb-2 font-medium text-brand-dark">GDPR Toestemming</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    checked={consentGiven}
                    onChange={handleConsentChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="gdprConsent" className="text-sm text-gray-700">
                    Ik ga akkoord met de opslag en verwerking van mijn gegevens volgens de GDPR-richtlijnen
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Database className="mt-1 h-5 w-5 text-brand-dark" />
              <div className="flex-1">
                <h3 className="mb-2 font-medium text-brand-dark">Gegevensbehoud</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">
                      Bewaar gegevens voor
                    </label>
                    <select
                      value={settings.dataRetention}
                      onChange={(e) => handleSettingChange('dataRetention', Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                    >
                      <option value={3}>3 maanden</option>
                      <option value={6}>6 maanden</option>
                      <option value={12}>12 maanden</option>
                      <option value={24}>24 maanden</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoDelete"
                      checked={settings.autoDeleteEnabled}
                      onChange={(e) => handleSettingChange('autoDeleteEnabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="autoDelete" className="text-sm text-gray-700">
                      Automatisch oude gegevens verwijderen
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Preferences */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Eye className="mt-1 h-5 w-5 text-brand-dark" />
              <div className="flex-1">
                <h3 className="mb-2 font-medium text-brand-dark">Privacy Voorkeuren</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="showEarnings"
                      checked={settings.showEarnings}
                      onChange={(e) => handleSettingChange('showEarnings', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="showEarnings" className="text-sm text-gray-700">
                      Toon verdiensten in overzichten
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={settings.notificationsEnabled}
                      onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="notifications" className="text-sm text-gray-700">
                      Sta meldingen toe
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start space-x-3">
              <Download className="mt-1 h-5 w-5 text-brand-dark" />
              <div className="flex-1">
                <h3 className="mb-2 font-medium text-brand-dark">Export Voorkeuren</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={settings.exportFormat === 'pdf'}
                        onChange={() => handleSettingChange('exportFormat', 'pdf')}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        checked={settings.exportFormat === 'csv'}
                        onChange={() => handleSettingChange('exportFormat', 'csv')}
                        className="h-4 w-4"
                      />
                      <span className="text-sm text-gray-700">CSV</span>
                    </label>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="mt-2 flex items-center space-x-2 rounded-md bg-brand-dark px-4 py-2 text-sm text-white hover:bg-opacity-90"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exporteer Mijn Gegevens</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleDeleteAllData}
              className="flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Verwijder Alle Gegevens</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-md bg-brand-dark px-4 py-2 text-sm text-white hover:bg-opacity-90"
            >
              Sluiten
            </button>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium">Uw Privacy Rechten:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Recht op inzage van uw persoonlijke gegevens</li>
              <li>Recht op correctie van onjuiste gegevens</li>
              <li>Recht op verwijdering van uw gegevens</li>
              <li>Recht op beperking van gegevensverwerking</li>
              <li>Recht op gegevensoverdraagbaarheid</li>
              <li>Recht om eerder gegeven toestemming in te trekken</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}