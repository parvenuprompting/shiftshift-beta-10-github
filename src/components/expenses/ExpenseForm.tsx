import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Expense } from '../../types';
import toast from 'react-hot-toast';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export function ExpenseForm({ expense, onSubmit, onClose }: ExpenseFormProps) {
  const [type, setType] = useState<Expense['type']>(expense?.type || 'other');
  const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
  const [description, setDescription] = useState(expense?.description || '');
  const [receipt, setReceipt] = useState<string | undefined>(expense?.receipt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Afbeelding is te groot (max 5MB)');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Alleen afbeeldingen zijn toegestaan');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amountNum = parseFloat(amount.replace(',', '.'));
    if (isNaN(amountNum)) {
      toast.error('Voer een geldig bedrag in');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: amountNum,
        description: description.trim(),
        receipt,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {expense ? 'Uitgave Bewerken' : 'Nieuwe Uitgave'}
          </h3>
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
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Expense['type'])}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
            >
              <option value="toll">Tol</option>
              <option value="meal">Maaltijd</option>
              <option value="fuel">Brandstof</option>
              <option value="other">Overig</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bedrag (€)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Omschrijving
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bon/Factuur (optioneel)
            </label>
            <div className="mt-1">
              {receipt ? (
                <div className="relative">
                  <img
                    src={receipt}
                    alt="Bon"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setReceipt(undefined)}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 text-gray-500 shadow-md hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500"
                >
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      Klik om een foto toe te voegen
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF tot 5MB
                    </div>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Bezig...' : expense ? 'Opslaan' : 'Toevoegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}