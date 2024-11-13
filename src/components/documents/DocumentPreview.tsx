import React from 'react';
import { X } from 'lucide-react';
import { Document } from '../../types';

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  const isImage = document.metadata?.mimeType?.startsWith('image/');
  const isPDF = document.metadata?.mimeType?.includes('pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="h-[calc(100%-4rem)] overflow-auto">
          {isImage && (
            <img
              src={document.fileUrl}
              alt={document.title}
              className="mx-auto max-h-full object-contain"
            />
          )}
          {isPDF && (
            <iframe
              src={`${document.fileUrl}#view=FitH`}
              title={document.title}
              className="h-full w-full"
            />
          )}
          {!isImage && !isPDF && (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                Preview niet beschikbaar voor dit bestandstype
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}