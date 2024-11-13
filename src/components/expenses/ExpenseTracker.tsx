import React, { useState } from 'react';
import { PlusCircle, Edit2, Trash2, DollarSign, Image as ImageIcon, CheckSquare, Square } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Expense } from '../../types';
import toast from 'react-hot-toast';

export function ExpenseTracker() {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { expenses, addExpense, deleteExpense, updateExpense } = useStore();

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'timestamp'>) => {
    try {
      await addExpense(expenseData);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Kon uitgave niet toevoegen');
    }
  };

  const handleEditExpense = async (expenseData: Partial<Expense>) => {
    if (editingExpense) {
      try {
        await updateExpense(editingExpense.id, expenseData);
        setEditingExpense(null);
      } catch (error) {
        console.error('Error updating expense:', error);
        toast.error('Kon uitgave niet bijwerken');
      }
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm('Weet u zeker dat u deze uitgave wilt verwijderen?')) {
      try {
        await deleteExpense(expenseId);
        setSelectedExpenses(prev => prev.filter(id => id !== expenseId));
        toast.success('Uitgave verwijderd');
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Kon uitgave niet verwijderen');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedExpenses.length) return;

    if (window.confirm(`Weet u zeker dat u ${selectedExpenses.length} uitgave(s) wilt verwijderen?`)) {
      setIsDeleting(true);
      try {
        for (const expenseId of selectedExpenses) {
          await deleteExpense(expenseId);
        }
        setSelectedExpenses([]);
        toast.success('Geselecteerde uitgaven verwijderd');
      } catch (error) {
        console.error('Error deleting expenses:', error);
        toast.error('Kon niet alle uitgaven verwijderen');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleExpenseSelection = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId)
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const toggleAllExpenses = () => {
    setSelectedExpenses(prev => 
      prev.length === expenses.length
        ? []
        : expenses.map(e => e.id)
    );
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">Uitgaven</h2>
          <DollarSign className="h-6 w-6 text-brand-dark" />
        </div>
        <div className="flex items-center space-x-2">
          {selectedExpenses.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="btn-danger flex items-center space-x-2"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {isDeleting 
                  ? 'Bezig met verwijderen...' 
                  : `Verwijder (${selectedExpenses.length})`}
              </span>
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nieuwe Uitgave</span>
          </button>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Totaal Uitgaven</span>
            <span className="text-lg font-semibold text-gray-900">
              € {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Overzicht</h3>
          {expenses.length > 0 && (
            <button
              onClick={toggleAllExpenses}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {selectedExpenses.length === expenses.length ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              <span>Selecteer alles</span>
            </button>
          )}
        </div>

        {expenses.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            Nog geen uitgaven geregistreerd
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleExpenseSelection(expense.id)}
                      className="mt-1 text-gray-400 hover:text-gray-600"
                    >
                      {selectedExpenses.includes(expense.id) ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          € {expense.amount.toFixed(2)}
                        </span>
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                          {expense.type === 'toll' && 'Tol'}
                          {expense.type === 'meal' && 'Maaltijd'}
                          {expense.type === 'fuel' && 'Brandstof'}
                          {expense.type === 'other' && 'Overig'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{expense.description}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(expense.timestamp), 'dd MMM yyyy HH:mm', { locale: nl })}
                      </p>
                      {expense.receipt && (
                        <div className="mt-2">
                          <img
                            src={expense.receipt}
                            alt="Bon"
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="btn-icon-confirm"
                      title="Bewerk uitgave"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="btn-icon-danger"
                      title="Verwijder uitgave"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showForm || editingExpense) && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
}