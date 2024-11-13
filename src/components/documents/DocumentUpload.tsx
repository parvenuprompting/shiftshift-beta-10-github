import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  onClose: () => void;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentUpload({ onClose }: DocumentUploadProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('other');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument } = useStore();

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Bestand is te groot (max 10MB)');
      return false;
    }

    if (ALLOWED_IMAGE_TYPES.includes(file.type) && type === 'other') {
      setType('image');
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.split('.')[0]);
      }

      // Create preview for images
      if (ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.split('.')[0]);
      }

      if (ALLOWED_IMAGE_TYPES.includes(droppedFile.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecteer een bestand');
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(file, type as any, title);
      toast.success('Document geüpload');
      onClose();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Kon document niet uploaden');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Document Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            >
              <option value="freight_letter">Vrachtbrief</option>
              <option value="delivery_note">Afleverbon</option>
              <option value="invoice">Factuur</option>
              <option value="image">Afbeelding</option>
              <option value="other">Overig</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bestand
            </label>
            <div
              className="mt-1"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 text-gray-500 shadow-md hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    {type === 'image' ? (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="text-sm text-gray-600">
                      {file ? file.name : 'Sleep een bestand of klik om te uploaden'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {type === 'image' 
                        ? 'JPG, PNG, GIF, WebP (max. 10MB)'
                        : 'PDF, Word, Excel, Afbeeldingen (max. 10MB)'}
                    </div>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept={type === 'image' 
                  ? '.jpg,.jpeg,.png,.gif,.webp' 
                  : '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg'}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isUploading}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isUploading || !file}
            >
              {isUploading ? 'Bezig met uploaden...' : 'Uploaden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}