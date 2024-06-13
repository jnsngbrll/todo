'use client';

import React, { createContext, ReactNode, useState } from 'react';
import axios from 'axios';

export const Context = createContext<any>(null);

interface ContextProviderProps {
  children: ReactNode;
}

interface ICategory {
  id: string;
  title: string;
}

interface TasksProps {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  createdAt: string;
}

export default function ContextProvider({ children }: ContextProviderProps) {
  const [categories, setCategpries] = useState<ICategory[]>([]);
  const [addTaskModalShow, setAddTaskModalShow] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);
  const [taskModalTitle, setTaskModalTitle] = useState<string>('Add task');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/task`);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = {
    categories,
    setCategpries,
    addTaskModalShow,
    setAddTaskModalShow,
    tasks,
    setTasks,
    taskModalTitle,
    setTaskModalTitle,
    fetchTasks,
  };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
