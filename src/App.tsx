import React from 'react';
import { useStore } from './store/useStore';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <>
        <LoginForm />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Header />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;