import React, { useState } from 'react';
import { File, FileText, Image, FileSpreadsheet, Trash2, Download, Eye, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Document } from '../../types';
import { useStore } from '../../store/useStore';
import { DocumentPreview } from './DocumentPreview';
import toast from 'react-hot-toast';

interface DocumentListProps {
  documents: Document[];
  view: 'grid' | 'list';
}

export function DocumentList({ documents, view }: DocumentListProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const { deleteDocument } = useStore();
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const handleDelete = async (doc: Document) => {
    if (!window.confirm('Weet u zeker dat u dit document wilt verwijderen?')) {
      return;
    }

    try {
      await deleteDocument(doc.id);
      toast.success('Document verwijderd');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Kon document niet verwijderen');
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(doc.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.metadata?.originalName || doc.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Kon document niet downloaden');
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="h-6 w-6" />;
    if (mimeType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (mimeType.includes('pdf')) return <FileText className="h-6 w-6" />;
    if (mimeType.includes('sheet')) return <FileSpreadsheet className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getFileIcon(doc.metadata?.mimeType)}
                <h3 className="font-medium text-gray-900">{doc.title}</h3>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(showMenu === doc.id ? null : doc.id)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {showMenu === doc.id && (
                  <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="mr-3 h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="mr-3 h-4 w-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Verwijderen
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">{doc.metadata?.originalName}</p>
            <div className="mt-2 text-xs text-gray-400">
              {format(new Date(doc.timestamp), 'dd MMM yyyy HH:mm', { locale: nl })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center space-x-4">
            {getFileIcon(doc.metadata?.mimeType)}
            <div>
              <h3 className="font-medium text-gray-900">{doc.title}</h3>
              <p className="text-sm text-gray-500">{doc.metadata?.originalName}</p>
              <p className="text-xs text-gray-400">
                {format(new Date(doc.timestamp), 'dd MMM yyyy HH:mm', { locale: nl })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownload(doc)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedDoc(doc)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Preview"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(doc)}
              className="rounded-full p-2 text-gray-400 hover:bg-red-100 hover:text-red-600"
              title="Verwijderen"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {selectedDoc && (
        <DocumentPreview 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </div>
  );
}