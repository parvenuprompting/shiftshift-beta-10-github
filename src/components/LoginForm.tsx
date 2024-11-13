import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Voer een naam in');
      return;
    }

    setIsLoading(true);
    try {
      await login(name);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Er is een fout opgetreden bij het inloggen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center">
          <Truck className="h-16 w-16 text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">ShiftShift</h1>
          <p className="mt-2 text-center text-gray-600">
            Omdat jouw tijd telt
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Naam
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>

          <p className="mt-4 text-center text-xs text-gray-600">
            Door in te loggen gaat u akkoord met onze privacyvoorwaarden en
            gegevensverwerking volgens de GDPR-richtlijnen.
          </p>
        </form>
      </div>
    </div>
  );
}