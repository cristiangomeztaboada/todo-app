// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://34.96.115.12.nip.io/api/todo';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export type CreateTaskDto = {
  title: string;
  completed?: boolean;
};

export type UpdateTaskDto = {
  title?: string;
  completed?: boolean;
};

// C de Create
export const createTask = async (task: CreateTaskDto): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Error creating task');
  return response.json();
};

// R de Read (All)
export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Error fetching tasks');
  return response.json();
};

// U de Update
export const updateTask = async (id: number, task: UpdateTaskDto): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Error updating task');
  return response.json();
};

// D de Delete
export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Error deleting task');
};