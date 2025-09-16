'use client'; // Esto es importante para usar hooks de React en Next.js App Router

import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, Task, CreateTaskDto, UpdateTaskDto } from '@/lib/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const createdTask = await createTask({ title: newTaskTitle });
      setTasks([createdTask, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando tareas...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Lista de Tareas</h1>

      {/* Formulario para Crear Tarea */}
      <form onSubmit={handleCreateTask} className="flex mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Añade una nueva tarea..."
          className="flex-1 p-2 border rounded-l-md focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
        >
          Añadir
        </button>
      </form>

      {/* Lista de Tareas */}
      <ul className="bg-white rounded-md shadow-md divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <li className="p-4 text-center text-gray-500">No hay tareas aún.</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleUpdateTask(task)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <span className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}