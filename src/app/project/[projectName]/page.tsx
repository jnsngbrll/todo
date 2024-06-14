'use client';

import React, { useContext, useEffect, useState } from 'react';

import TaskCard from '@/components/cards/TaskCard';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { Context } from '@/context/Context';

import { IoAdd, IoChevronForward } from 'react-icons/io5';
import getActiveList from '@/actions/getActiveList';

export default function TasksPage() {
  const {
    tasks,
    setTasks,
    addTaskModalShow,
    setAddTaskModalShow,
    setTaskModalTitle,
    fetchTasks,
  } = useContext(Context);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeList = getActiveList();

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTaskButtonClick = () => {
    setAddTaskModalShow(!addTaskModalShow);
    setTaskModalTitle('Add task');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between relative">
        <h1 className="font-bold text-white">
          {activeList?.replaceAll('-', ' ')}
        </h1>
        {activeList !== 'all' && (
          <button
            onClick={handleAddTaskButtonClick}
            className="p-2 bg-white rounded-md"
          >
            {!addTaskModalShow ? <IoAdd /> : <IoChevronForward />}
          </button>
        )}

        <div
          className={`absolute top-0 right-16 transition-all duration-200 ${
            !addTaskModalShow ? 'translate-x-[520px]' : 'translate-x-0'
          }`}
        >
          <AddTaskModal />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task: any) => {
          if (activeList === 'all') {
            return (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                isCompleted={task.isCompleted}
                createdAt={task.createdAt}
              />
            );
          } else if (activeList === task.project.replaceAll(' ', '-')) {
            return (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                isCompleted={task.isCompleted}
                createdAt={task.createdAt}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
