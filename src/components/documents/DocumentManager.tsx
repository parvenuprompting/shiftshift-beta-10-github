import React, { useState } from 'react';
import { File, Upload, Search, Grid, List } from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { DocumentSearch } from './DocumentSearch';
import { ViewToggle } from './ViewToggle';
import { useStore } from '../../store/useStore';

export function DocumentManager() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const { documents } = useStore();

  const filteredDocuments = documents
    .filter(doc => 
      (selectedType === 'all' || doc.type === selectedType) &&
      (searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.metadata?.originalName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <File className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Documenten</h2>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DocumentSearch 
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="all">Alle Types</option>
            <option value="freight_letter">Vrachtbrief</option>
            <option value="delivery_note">Afleverbon</option>
            <option value="invoice">Factuur</option>
            <option value="other">Overig</option>
          </select>

          <ViewToggle 
            view={view} 
            onViewChange={setView} 
          />
        </div>
      </div>

      <DocumentList 
        documents={filteredDocuments}
        view={view}
      />

      {showUpload && (
        <DocumentUpload onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
}