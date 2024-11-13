import React, { useState } from 'react';
import { Plus, Check, Square, Clock, Tag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface TaskListProps {
  searchTerm: string;
  sortOrder: 'asc' | 'desc';
  filterStatus: 'all' | 'completed' | 'pending';
}

export function TaskList({ searchTerm, sortOrder, filterStatus }: TaskListProps) {
  const [newTask, setNewTask] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const { currentSession, addTask, toggleTask } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
      toast.success('Taak toegevoegd');
    }
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
    toast.success('Taak status bijgewerkt');
  };

  const filteredTasks = currentSession?.tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' 
      ? true 
      : filterStatus === 'completed' 
        ? task.completed 
        : !task.completed;
    return matchesSearch && matchesStatus;
  }) || [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const categories = ['Transport', 'Administratie', 'Onderhoud', 'Overig'];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Voeg een nieuwe taak toe..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">Selecteer categorie</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            {searchTerm ? 'Geen taken gevonden' : 'Nog geen taken toegevoegd'}
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  {task.completed ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
                <div className="flex flex-col">
                  <span
                    className={`text-sm ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                    }`}
                  >
                    {task.description}
                  </span>
                  <span className="text-xs text-gray-500">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    {format(new Date(task.timestamp), 'HH:mm', { locale: nl })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}